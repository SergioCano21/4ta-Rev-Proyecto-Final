import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest, Gender, Patient, Vital } from "../types/types";
import { prisma } from "../config/prisma";
import { pubsub, TOPICS } from "../graphql/pubsub";
import { getStatus, STATUS } from "../utils/patient.utils";

export const createPatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering createPatient endpoint");

    const { name, age, gender }: Patient = req.body;

    if (!name || !age || !gender) {
      throw new AppError(400, "Missing arguments");
    }

    if (!Object.values(Gender).includes(gender)) {
      throw new AppError(400, "Invalid gender input");
    }

    const patient = await prisma.patient.create({
      data: { name, age, gender, doctorId: req.user?.id! },
    });

    console.log("Register successful");
    console.log("Registered patient: ", patient.name);

    res.status(201).json({ error: false, message: "Register successful" });
  } catch (error) {
    next(error);
  }
};

export const getPatients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering getPatients endpoint");

    const patients = await prisma.patient.findMany({
      where: { doctorId: req.user?.id! },
      include: { vitals: { take: 1, orderBy: { timestamp: "desc" } } },
    });

    const patientsWithStatus = patients.map((patient) => {
      return { ...patient, status: getStatus(patient.vitals[0]?.heartRate!, patient.vitals[0]?.oxygenLevel!, patient.vitals[0]?.bodyTemperature!) };
    });

    console.log("Patients retrieved successfully");
    console.log("Number of patients retrieved: ", patients.length);

    res.status(200).json({ error: false, message: "Patients retrieved successfully", data: patientsWithStatus });
  } catch (error) {
    next(error);
  }
};

export const uploadVital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Entering uploadVital endpoint");

    const { deviceId, heartRate, oxygenLevel, bodyTemperature, steps, patientId }: Vital = req.body;

    if (!deviceId || !heartRate || !oxygenLevel || !bodyTemperature || !steps || !patientId) {
      throw new AppError(400, "Missing arguments");
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(400, "Incorrect patient id");
    }

    const ox = Number(oxygenLevel);
    const temp = Number(bodyTemperature);

    const vital = await prisma.vital.create({
      data: {
        deviceId,
        heartRate,
        oxygenLevel: Number(ox.toFixed(2)),
        bodyTemperature: Number(temp.toFixed(2)),
        steps,
        patientId,
      },
    });

    await pubsub.publish(TOPICS.LIVE_VITALS, { liveVital: { ...vital, doctorId: patient.doctorId } });

    console.log("Vital uploaded successfully");
    console.log("Vital id: ", vital.id);

    res.status(200).json({ error: false, message: "Successful upload" });
  } catch (error) {
    next(error);
  }
};

export const getPatientsCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering getPatientsCount endpoint");

    const patients = await prisma.patient.findMany({
      where: { doctorId: req.user?.id! },
    });

    console.log("Patients retrieved successfully");
    console.log("Number of patients retrieved: ", patients.length);

    res.status(200).json({ error: false, message: "Patients count retrieved successfully", data: patients.length });
  } catch (error) {
    next(error);
  }
};

export const getAverageHR = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering getAverageHR endpoint");

    const minAgo = new Date(Date.now() - 5 * 60 * 1000);

    const patients = await prisma.patient.findMany({
      where: { doctorId: req.user?.id! },
      include: { vitals: { where: { timestamp: { gte: minAgo } } } },
    });

    const heartRates: number[] = [];

    patients.forEach((patient) => {
      patient.vitals.forEach((vital) => {
        heartRates.push(vital.heartRate);
      });
    });

    if (heartRates.length === 0) {
      res.status(200).json({ error: false, message: "Heart vitals average retrieved successfully", data: 0 });
    } else {
      const avgHR = (heartRates.reduce((acc, cur) => acc + cur, 0) / heartRates.length).toFixed(2);

      console.log("Heart vitals average retrieved successfully");
      console.log("HR Average: ", avgHR);

      res.status(200).json({ error: false, message: "Heart vitals average retrieved successfully", data: avgHR });
    }
  } catch (error) {
    next(error);
  }
};

export const getActiveAlerts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering getActiveAlerts endpoint");

    const patients = await prisma.patient.findMany({
      where: { doctorId: req.user?.id! },
      include: { vitals: { take: 1, orderBy: { timestamp: "desc" } } },
    });

    const patientsWithStatus = patients.map((patient) => {
      return { ...patient, status: getStatus(patient.vitals[0]?.heartRate!, patient.vitals[0]?.oxygenLevel!, patient.vitals[0]?.bodyTemperature!) };
    });

    const activeAlerts = patientsWithStatus.filter((patient) => patient.status === STATUS.ALERT);

    console.log("Active alerts retrieved successfully");
    console.log("Number of active alerts: ", activeAlerts.length);

    res.status(200).json({ error: false, message: "Active alerts retrieved successfully", data: activeAlerts.length });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Entering getPatientById endpoint");

    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
      include: { vitals: { take: 10, orderBy: { timestamp: "desc" } } },
    });

    const patientWithStatus = {
      ...patient,
      vitals: patient?.vitals.map((vital) => ({
        ...vital,
        status: getStatus(vital.heartRate, vital.oxygenLevel, vital.bodyTemperature),
      })),
    };

    console.log("Patient retrieved successfully");

    res.status(200).json({ error: false, message: "Patient retrieved successfully", data: patientWithStatus });
  } catch (error) {
    next(error);
  }
};
