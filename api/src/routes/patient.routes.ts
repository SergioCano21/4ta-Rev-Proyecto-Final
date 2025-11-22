import { Router } from "express";
import {
  createPatient,
  getActiveAlerts,
  getAverageHR,
  getPatientById,
  getPatients,
  getPatientsCount,
  uploadVital,
} from "../controllers/patient.controller";
import { protect } from "../middlewares/auth.middleware";

const patientRouter = Router();

patientRouter.get("/", protect, getPatients);
patientRouter.post("/", protect, createPatient);
patientRouter.post("/data", uploadVital);

patientRouter.get("/count", protect, getPatientsCount);
patientRouter.get("/averageHR", protect, getAverageHR);
patientRouter.get("/alerts", protect, getActiveAlerts);
patientRouter.get("/:id", protect, getPatientById);

export default patientRouter;
