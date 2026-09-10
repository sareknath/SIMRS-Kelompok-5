import { useState } from "react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
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

export default function NurseStation() {
  const { visits, getPatient, setVitalSign, addNote, markReady } = useClinic();
  const { user } = useAuth();
  const [activeVisitId, setActiveVisitId] = useState<string | null>(
    visits.find((v) => v.status === "menunggu_perawat")?.id ?? null
  );
  const [vital, setVital] = useState<VitalSign>(emptyVital());
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<"normal" | "prioritas">("normal");

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
    const next = queue.find(
      (v) => v.id !== activeVisitId && v.status === "menunggu_perawat"
    );
    setActiveVisitId(next?.id ?? null);
    setVital(emptyVital());
    setNote("");
    setPriority("normal");
  };

  return (
    <AppShell>
      <div className="flex h-screen flex-col p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Nurse Station
        </h1>
        <p className="mt-1 text-sm text-muted">
          Catat tanda vital dan tandai pasien siap diperiksa dokter.
        </p>

        <div className="mt-6 grid flex-1 grid-cols-[280px_1fr] gap-6 overflow-hidden">
          {/* Queue list */}
          <div className="overflow-y-auto rounded-lg bg-white shadow-soft">
            {queue.map((v) => {
              const patient = getPatient(v.patientId);
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v.id)}
                  className={`block w-full border-b border-line px-4 py-3 text-left last:border-0 ${
                    v.id === activeVisitId ? "bg-teal-100" : "hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">
                      #{v.queueNumber} {patient?.name}
                    </span>
                    <span className="text-xs text-muted">{v.checkInTime}</span>
                  </div>
                  <div className="mt-1.5">
                    <StatusBadge status={v.status} />
                  </div>
                </button>
              );
            })}
            {queue.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted">
                Tidak ada pasien dalam antrian.
              </p>
            )}
          </div>

          {/* Form panel */}
          <div className="overflow-y-auto rounded-lg bg-white shadow-soft p-6">
            {!activeVisit || !activePatient ? (
              <p className="text-sm text-muted">
                Pilih pasien dari daftar antrian untuk mulai mencatat tanda
                vital.
              </p>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">
                      {activePatient.name}
                    </p>
                    <p className="text-xs text-muted">
                      Antrian #{activeVisit.queueNumber} · Check-in{" "}
                      {activeVisit.checkInTime}
                    </p>
                  </div>
                  <StatusBadge status={activeVisit.status} />
                </div>

                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                  Tanda Vital
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <VitalInput
                    label="Sistolik (mmHg)"
                    value={vital.systolic}
                    onChange={(v) => setVital({ ...vital, systolic: v })}
                  />
                  <VitalInput
                    label="Diastolik (mmHg)"
                    value={vital.diastolic}
                    onChange={(v) => setVital({ ...vital, diastolic: v })}
                  />
                  <VitalInput
                    label="Nadi (/menit)"
                    value={vital.pulse}
                    onChange={(v) => setVital({ ...vital, pulse: v })}
                  />
                  <VitalInput
                    label="Suhu (°C)"
                    value={vital.temperature}
                    onChange={(v) => setVital({ ...vital, temperature: v })}
                    step="0.1"
                  />
                  <VitalInput
                    label="SpO2 (%)"
                    value={vital.spo2}
                    onChange={(v) => setVital({ ...vital, spo2: v })}
                  />
                  <VitalInput
                    label="Napas (/menit)"
                    value={vital.respRate}
                    onChange={(v) => setVital({ ...vital, respRate: v })}
                  />
                </div>

                <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted">
                  Catatan untuk Dokter
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Contoh: keluhan, riwayat, hal yang perlu diperhatikan dokter..."
                  className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <div className="mt-2 flex gap-4 text-sm">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      checked={priority === "normal"}
                      onChange={() => setPriority("normal")}
                    />
                    Normal
                  </label>
                  <label className="flex items-center gap-1.5 text-brick-600">
                    <input
                      type="radio"
                      checked={priority === "prioritas"}
                      onChange={() => setPriority("prioritas")}
                    />
                    Prioritas / Kondisi mendesak
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-6 w-full rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  Tandai Siap Diperiksa Dokter
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

function VitalInput({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      <input
        type="number"
        step={step}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-sm border border-line px-3 py-2 text-sm font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
      />
    </div>
  );
}
