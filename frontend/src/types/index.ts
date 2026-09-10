export type Role = "admin" | "dokter" | "perawat" | "apoteker";

export interface StaffUser {
  id: string;
  name: string;
  role: Role;
}

export interface Patient {
  id: string;
  name: string;
  nik: string;
  birthDate: string;
  gender: "L" | "P";
  phone: string;
  address: string;
}

export type VisitStatus =
  | "menunggu_perawat"
  | "siap_diperiksa"
  | "sedang_diperiksa"
  | "selesai";

export interface VitalSign {
  systolic: number;
  diastolic: number;
  pulse: number;
  temperature: number;
  spo2: number;
  respRate: number;
  recordedBy: string;
  recordedAt: string;
}

export interface NurseNote {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  priority?: "normal" | "prioritas";
}

export interface Diagnosis {
  code: string;
  label: string;
}

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  visitId: string;
  items: PrescriptionItem[];
  createdBy: string;
  createdAt: string;
  dispensed: boolean;
}

export interface Visit {
  id: string;
  patientId: string;
  queueNumber: number;
  status: VisitStatus;
  checkInTime: string;
  vitalSign?: VitalSign;
  notes: NurseNote[];
  anamnesis?: string;
  diagnoses?: Diagnosis[];
  procedures?: string[];
  assignedDoctor?: string;
}
