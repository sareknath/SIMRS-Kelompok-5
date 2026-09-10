import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  Visit,
  VitalSign,
  NurseNote,
  Diagnosis,
  Prescription,
  PrescriptionItem,
} from "../types";
import {
  initialVisits,
  patients as initialPatients,
  prescriptions as initialPrescriptions,
} from "../data/dummy";
import type { Patient } from "../types";

interface ClinicContextType {
  patients: Patient[];
  visits: Visit[];
  prescriptions: Prescription[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  setVitalSign: (visitId: string, vital: VitalSign) => void;
  addNote: (visitId: string, note: Omit<NurseNote, "id">) => void;
  markReady: (visitId: string) => void;
  startExamine: (visitId: string, doctorName: string) => void;
  saveMedicalRecord: (
    visitId: string,
    data: { anamnesis: string; diagnoses: Diagnosis[]; procedures: string[] }
  ) => void;
  completeVisit: (visitId: string) => void;
  addPrescription: (
    visitId: string,
    items: PrescriptionItem[],
    createdBy: string
  ) => void;
  dispensePrescription: (prescriptionId: string) => void;
  getPatient: (patientId: string) => Patient | undefined;
  lastQueueEvent: string | null;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

let noteIdCounter = 100;
let prescriptionIdCounter = 100;

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    initialPrescriptions
  );
  const [lastQueueEvent, setLastQueueEvent] = useState<string | null>(null);

  const getPatient = (patientId: string) =>
    patients.find((p) => p.id === patientId);

  const addPatient = (patient: Patient) =>
    setPatients((prev) => [...prev, patient]);

  const updatePatient = (patient: Patient) =>
    setPatients((prev) => prev.map((p) => (p.id === patient.id ? patient : p)));

  const setVitalSign = (visitId: string, vital: VitalSign) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, vitalSign: vital } : v))
    );
  };

  const addNote = (visitId: string, note: Omit<NurseNote, "id">) => {
    noteIdCounter += 1;
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, notes: [...v.notes, { ...note, id: `n${noteIdCounter}` }] }
          : v
      )
    );
  };

  const markReady = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, status: "siap_diperiksa" } : v
      )
    );
    const patientName = (() => {
      const visit = visits.find((v) => v.id === visitId);
      return visit ? getPatient(visit.patientId)?.name : undefined;
    })();
    setLastQueueEvent(
      `${patientName ?? "Pasien"} baru saja masuk ke antrian dokter`
    );
    window.setTimeout(() => setLastQueueEvent(null), 4000);
  };

  const startExamine = (visitId: string, doctorName: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, status: "sedang_diperiksa", assignedDoctor: doctorName }
          : v
      )
    );
  };

  const saveMedicalRecord: ClinicContextType["saveMedicalRecord"] = (
    visitId,
    data
  ) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, ...data } : v))
    );
  };

  const completeVisit = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: "selesai" } : v))
    );
  };

  const addPrescription: ClinicContextType["addPrescription"] = (
    visitId,
    items,
    createdBy
  ) => {
    prescriptionIdCounter += 1;
    const newRx: Prescription = {
      id: `rx${prescriptionIdCounter}`,
      visitId,
      items,
      createdBy,
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dispensed: false,
    };
    setPrescriptions((prev) => [...prev, newRx]);
  };

  const dispensePrescription = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === prescriptionId ? { ...rx, dispensed: true } : rx
      )
    );
  };

  return (
    <ClinicContext.Provider
      value={{
        patients,
        visits,
        prescriptions,
        addPatient,
        updatePatient,
        setVitalSign,
        addNote,
        markReady,
        startExamine,
        saveMedicalRecord,
        completeVisit,
        addPrescription,
        dispensePrescription,
        getPatient,
        lastQueueEvent,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
