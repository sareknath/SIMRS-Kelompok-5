import { useState } from "react";
import { ClipboardPlus, Thermometer, Heart, Wind, Droplets, CheckCircle, AlertTriangle } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import PatientAvatar from "../components/PatientAvatar";
import QueueToast from "../components/QueueToast";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";
import type { VitalSign } from "../types";

const emptyVital = (): VitalSign => ({
  systolic: 0,
  diastolic: 0,
  pulse: 0,
  temperature: 0,
  spo2: 0,
  respRate: 0,
  recordedBy: "",
  recordedAt: "",
});

function isAbnormal(key: string, value: number): boolean {
  if (key === "systolic" && (value > 140 || value < 90)) return true;
  if (key === "diastolic" && (value > 90 || value < 60)) return true;
  if (key === "pulse" && (value > 100 || value < 60)) return true;
  if (key === "temperature" && (value > 37.5 || value < 36.0)) return true;
  if (key === "spo2" && value < 95) return true;
  if (key === "respRate" && (value > 20 || value < 12)) return true;
  return false;
}

export default function NurseStation() {
  const { visits, getPatient, setVitalSign, addNote, markReady } = useClinic();
  const { user } = useAuth();
  const [activeVisitId, setActiveVisitId] = useState<string | null>(
    visits.find((v) => v.status === "menunggu_perawat")?.id ?? null
  );
  const [vital, setVital] = useState<VitalSign>(emptyVital());
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<"normal" | "prioritas">("normal");
  const [submitted, setSubmitted] = useState(false);

  const queue = visits.filter(
    (v) => v.status === "menunggu_perawat" || v.status === "siap_diperiksa"
  );
  const activeVisit = visits.find((v) => v.id === activeVisitId);
  const activePatient = activeVisit ? getPatient(activeVisit.patientId) : null;

  const handleSelect = (visitId: string) => {
    setActiveVisitId(visitId);
    setVital(emptyVital());
    setNote("");
    setPriority("normal");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!activeVisitId) return;
    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setVitalSign(activeVisitId, {
      ...vital,
      recordedBy: user?.name ?? "Perawat",
      recordedAt: time,
    });
    if (note.trim()) {
      addNote(activeVisitId, {
        author: user?.name ?? "Perawat",
        message: note.trim(),
        createdAt: time,
        priority,
      });
    }
    markReady(activeVisitId);
    setSubmitted(true);
    setTimeout(() => {
      const next = queue.find(
        (v) => v.id !== activeVisitId && v.status === "menunggu_perawat"
      );
      setActiveVisitId(next?.id ?? null);
      setVital(emptyVital());
      setNote("");
      setPriority("normal");
      setSubmitted(false);
    }, 1200);
  };

  const vitalFields: {
    key: keyof VitalSign;
    label: string;
    unit: string;
    icon: typeof Heart;
    step?: string;
  }[] = [
    { key: "systolic", label: "Sistolik", unit: "mmHg", icon: Heart },
    { key: "diastolic", label: "Diastolik", unit: "mmHg", icon: Heart },
    { key: "pulse", label: "Nadi", unit: "/mnt", icon: Heart },
    { key: "temperature", label: "Suhu", unit: "°C", icon: Thermometer, step: "0.1" },
    { key: "spo2", label: "SpO2", unit: "%", icon: Droplets },
    { key: "respRate", label: "Pernapasan", unit: "/mnt", icon: Wind },
  ];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-65px)] flex-col p-6 lg:p-8 animate-fade-in">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
            <ClipboardPlus className="h-5 w-5 text-teal-700" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              Nurse Station
            </h1>
            <p className="text-sm text-muted">
              Catat tanda vital dan tandai pasien siap diperiksa dokter.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[300px_1fr] gap-6 overflow-hidden">
          {/* Queue list */}
          <div className="flex flex-col overflow-hidden">
            <p className="section-label mb-2">Antrian ({queue.length})</p>
            <div className="flex-1 overflow-y-auto rounded-2xl card">
              {queue.map((v) => {
                const patient = getPatient(v.patientId);
                const isActive = v.id === activeVisitId;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelect(v.id)}
                    className={`block w-full border-b border-line px-4 py-3.5 text-left transition-all last:border-0 ${
                      isActive
                        ? "bg-cyan-50 border-l-4 border-l-cyan-500"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                        #{v.queueNumber}
                      </div>
                      <PatientAvatar name={patient?.name ?? "?"} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {patient?.name}
                        </p>
                        <p className="text-xs text-muted">
                          Check-in {v.checkInTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ml-10">
                      <StatusBadge status={v.status} />
                    </div>
                  </button>
                );
              })}
              {queue.length === 0 && (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <CheckCircle className="mb-3 h-10 w-10 text-success-500" />
                  <p className="text-sm font-medium text-ink">Semua Clear!</p>
                  <p className="mt-1 text-xs text-muted">Tidak ada pasien dalam antrian.</p>
                </div>
              )}
            </div>
          </div>

          {/* Form panel */}
          <div className="overflow-y-auto rounded-2xl card p-6">
            {!activeVisit || !activePatient ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ClipboardPlus className="mb-4 h-14 w-14 text-line" strokeWidth={1.5} />
                <p className="font-semibold text-ink">Pilih Pasien</p>
                <p className="mt-1 max-w-xs text-sm text-muted">
                  Pilih pasien dari daftar antrian di sebelah kiri untuk mulai mencatat tanda vital.
                </p>
              </div>
            ) : (
              <>
                {/* Patient header */}
                <div className="mb-6 flex items-start justify-between rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 p-4">
                  <div className="flex items-center gap-3">
                    <PatientAvatar name={activePatient.name} size="md" />
                    <div>
                      <p className="font-display text-lg font-bold text-ink">
                        {activePatient.name}
                      </p>
                      <p className="text-xs text-muted">
                        Antrian #{activeVisit.queueNumber} · Check-in{" "}
                        {activeVisit.checkInTime}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={activeVisit.status} />
                </div>

                {/* Vital Signs */}
                <p className="section-label mb-3">Tanda Vital</p>
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {vitalFields.map(({ key, label, unit, step }) => {
                    const val = vital[key] as number;
                    const abnormal = val > 0 && isAbnormal(key, val);
                    return (
                      <div key={key}>
                        <label className="mb-1 flex items-center justify-between text-xs font-medium text-muted">
                          <span>{label}</span>
                          {abnormal && (
                            <AlertTriangle className="h-3.5 w-3.5 text-danger-500" />
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step={step}
                            value={val || ""}
                            onChange={(e) =>
                              setVital({ ...vital, [key]: Number(e.target.value) })
                            }
                            className={`input-base pr-12 font-mono ${
                              abnormal
                                ? "border-danger-500 bg-danger-100/30 focus:border-danger-500"
                                : ""
                            }`}
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted">
                            {unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Note */}
                <p className="section-label mb-2">Catatan untuk Dokter</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Contoh: keluhan, riwayat, hal yang perlu diperhatikan dokter..."
                  className="input-base mb-3 resize-none"
                />

                {/* Priority */}
                <div className="mb-6 flex gap-3">
                  {(["normal", "prioritas"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                        priority === p
                          ? p === "normal"
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                            : "border-danger-500 bg-danger-100 text-danger-600"
                          : "border-line bg-white text-muted hover:border-slate-300"
                      }`}
                    >
                      {p === "prioritas" && <AlertTriangle className="h-4 w-4" />}
                      {p === "normal" ? "Normal" : "Prioritas / Mendesak"}
                    </button>
                  ))}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`btn-primary w-full py-3 text-base transition-all ${
                    submitted ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Berhasil! Pasien siap diperiksa…
                    </span>
                  ) : (
                    "Tandai Siap Diperiksa Dokter ✓"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <QueueToast />
    </AppShell>
  );
}
