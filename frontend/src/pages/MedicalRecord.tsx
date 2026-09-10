import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";
import type { Diagnosis } from "../types";

const commonDiagnoses: Diagnosis[] = [
  { code: "J06", label: "Infeksi Saluran Napas Atas Akut" },
  { code: "I10", label: "Hipertensi Esensial" },
  { code: "E11", label: "Diabetes Melitus Tipe 2" },
  { code: "A09", label: "Diare dan Gastroenteritis" },
  { code: "M54", label: "Nyeri Punggung" },
];

export default function MedicalRecord() {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visits, getPatient, addNote, saveMedicalRecord, completeVisit } =
    useClinic();

  const visit = visits.find((v) => v.id === visitId);
  const patient = visit ? getPatient(visit.patientId) : undefined;

  const [anamnesis, setAnamnesis] = useState(visit?.anamnesis ?? "");
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>(
    visit?.diagnoses ?? []
  );
  const [procedureText, setProcedureText] = useState(
    visit?.procedures?.join(", ") ?? ""
  );
  const [replyNote, setReplyNote] = useState("");

  if (!visit || !patient) {
    return (
      <AppShell>
        <div className="p-8 text-sm text-muted">Kunjungan tidak ditemukan.</div>
      </AppShell>
    );
  }

  const toggleDiagnosis = (d: Diagnosis) => {
    setSelectedDiagnoses((prev) =>
      prev.some((x) => x.code === d.code)
        ? prev.filter((x) => x.code !== d.code)
        : [...prev, d]
    );
  };

  const handleSaveAndComplete = () => {
    saveMedicalRecord(visit.id, {
      anamnesis,
      diagnoses: selectedDiagnoses,
      procedures: procedureText
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    });
    completeVisit(visit.id);
    navigate("/antrian-dokter");
  };

  const handleReply = () => {
    if (!replyNote.trim()) return;
    addNote(visit.id, {
      author: user?.name ?? "Dokter",
      message: replyNote.trim(),
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setReplyNote("");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {patient.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Antrian #{visit.queueNumber} · NIK {patient.nik}
            </p>
          </div>
          <StatusBadge status={visit.status} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {visit.vitalSign && (
              <div className="rounded-lg bg-white shadow-soft p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                  Tanda Vital
                </p>
                <div className="grid grid-cols-3 gap-3 font-mono text-sm sm:grid-cols-6">
                  <VitalTag label="TD" value={`${visit.vitalSign.systolic}/${visit.vitalSign.diastolic}`} />
                  <VitalTag label="Nadi" value={`${visit.vitalSign.pulse}/mnt`} />
                  <VitalTag label="Suhu" value={`${visit.vitalSign.temperature}°C`} />
                  <VitalTag label="SpO2" value={`${visit.vitalSign.spo2}%`} />
                  <VitalTag label="Napas" value={`${visit.vitalSign.respRate}/mnt`} />
                </div>
              </div>
            )}

            <div className="rounded-lg bg-white shadow-soft p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Anamnesis
              </p>
              <textarea
                value={anamnesis}
                onChange={(e) => setAnamnesis(e.target.value)}
                rows={3}
                placeholder="Keluhan dan riwayat pasien..."
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="rounded-lg bg-white shadow-soft p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Diagnosis
              </p>
              <div className="flex flex-wrap gap-2">
                {commonDiagnoses.map((d) => {
                  const active = selectedDiagnoses.some(
                    (x) => x.code === d.code
                  );
                  return (
                    <button
                      key={d.code}
                      onClick={() => toggleDiagnosis(d)}
                      className={`rounded-sm border px-3 py-1.5 text-xs ${
                        active
                          ? "border-teal-700 bg-teal-100 text-teal-900"
                          : "border-line text-ink/70 hover:border-teal-600"
                      }`}
                    >
                      <span className="font-mono">{d.code}</span> · {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-white shadow-soft p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Tindakan
              </p>
              <input
                value={procedureText}
                onChange={(e) => setProcedureText(e.target.value)}
                placeholder="Pisahkan dengan koma, contoh: Nebulizer, Pemeriksaan gula darah"
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/kunjungan/${visit.id}/resep`)}
                className="rounded-full border border-teal-700 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
              >
                Buat Resep
              </button>
              <button
                onClick={handleSaveAndComplete}
                className="rounded-full bg-teal-900 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Simpan &amp; Selesaikan Kunjungan
              </button>
            </div>
          </div>

          {/* Notes / chat with nurse */}
          <div className="rounded-lg bg-white shadow-soft p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
              Catatan Perawat ↔ Dokter
            </p>
            <div className="space-y-2">
              {visit.notes.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-sm px-3 py-2 text-sm ${
                    n.priority === "prioritas"
                      ? "bg-brick-100 text-brick-600"
                      : "bg-paper text-ink/80"
                  }`}
                >
                  <p className="mb-0.5 text-xs font-medium text-muted">
                    {n.author} · {n.createdAt}
                  </p>
                  {n.message}
                </div>
              ))}
              {visit.notes.length === 0 && (
                <p className="text-sm text-muted">Belum ada catatan.</p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                placeholder="Tulis catatan..."
                className="flex-1 rounded-sm border border-line px-3 py-2 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                onClick={handleReply}
                className="rounded-full bg-teal-900 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function VitalTag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
