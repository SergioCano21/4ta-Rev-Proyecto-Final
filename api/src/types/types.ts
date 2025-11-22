import { Request } from "express";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
export interface Patient {
  name: string;
  age: number;
  gender: Gender;
}

export interface User {
  username: string;
  password: string;
}

export interface Vital {
  deviceId: string;
  heartRate: number;
  oxygenLevel: number;
  bodyTemperature: number;
  steps: number;
  patientId: number;
}

export interface AuthRequest extends Request {
  user?: { id: number };
}
