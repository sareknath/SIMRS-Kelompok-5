import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Activity,
  FileText,
  Pill,
  CheckCircle,
  MessageCircle,
  Send,
  AlertTriangle,
} from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import PatientAvatar from "../components/PatientAvatar";
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

function VitalCard({
  label,
  value,
  abnormal,
}: {
  label: string;
  value: string;
  abnormal?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl px-3 py-3 text-center ${
        abnormal ? "bg-danger-100" : "bg-paper"
      }`}
    >
      {abnormal && (
        <AlertTriangle className="mb-1 h-3.5 w-3.5 text-danger-500" />
      )}
      <span className="text-[11px] font-medium text-muted">{label}</span>
      <span
        className={`mt-0.5 font-mono text-sm font-bold ${
          abnormal ? "text-danger-600" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

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

  const vs = visit.vitalSign;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-6 lg:p-8 animate-fade-in">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/antrian-dokter")}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-cyan-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Antrian
        </button>

        {/* Patient header */}
        <div className="mb-6 flex items-start justify-between rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 p-5">
          <div className="flex items-center gap-4">
            <PatientAvatar name={patient.name} size="lg" />
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                {patient.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                Antrian #{visit.queueNumber} · NIK {patient.nik}
              </p>
              <div className="mt-2">
                <StatusBadge status={visit.status} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/kunjungan/${visit.id}/resep`)}
              className="flex items-center gap-2 rounded-xl border-2 border-primary-500/40 bg-white px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
            >
              <Pill className="h-4 w-4" />
              Buat Resep
            </button>
            <button
              onClick={handleSaveAndComplete}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Simpan & Selesaikan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Main form */}
          <div className="col-span-2 space-y-5">
            {/* Vital Signs */}
            {vs && (
              <div className="card rounded-2xl p-5">
                <p className="section-label mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-600" />
                  Tanda Vital
                </p>
                <div className="grid grid-cols-5 gap-2">
                  <VitalCard
                    label="TD"
                    value={`${vs.systolic}/${vs.diastolic}`}
                    abnormal={vs.systolic > 140 || vs.diastolic > 90}
                  />
                  <VitalCard
                    label="Nadi"
                    value={`${vs.pulse}/mnt`}
                    abnormal={vs.pulse > 100 || vs.pulse < 60}
                  />
                  <VitalCard
                    label="Suhu"
                    value={`${vs.temperature}°C`}
                    abnormal={vs.temperature > 37.5}
                  />
                  <VitalCard
                    label="SpO2"
                    value={`${vs.spo2}%`}
                    abnormal={vs.spo2 < 95}
                  />
                  <VitalCard
                    label="Napas"
                    value={`${vs.respRate}/mnt`}
                    abnormal={vs.respRate > 20}
                  />
                </div>
                <p className="mt-2 text-right text-xs text-muted">
                  Dicatat oleh {vs.recordedBy} · {vs.recordedAt}
                </p>
              </div>
            )}

            {/* Anamnesis */}
            <div className="card rounded-2xl p-5">
              <p className="section-label mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-600" />
                Anamnesis
              </p>
              <textarea
                value={anamnesis}
                onChange={(e) => setAnamnesis(e.target.value)}
                rows={4}
                placeholder="Keluhan utama, riwayat penyakit, riwayat pengobatan sebelumnya..."
                className="input-base resize-none"
              />
            </div>

            {/* Diagnosis */}
            <div className="card rounded-2xl p-5">
              <p className="section-label mb-3">Diagnosis</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonDiagnoses.map((d) => {
                  const active = selectedDiagnoses.some((x) => x.code === d.code);
                  return (
                    <button
                      key={d.code}
                      onClick={() => toggleDiagnosis(d)}
                      className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-cyan-500 bg-cyan-500 text-white shadow-sm"
                          : "border-line bg-white text-muted hover:border-cyan-300 hover:text-cyan-700"
                      }`}
                    >
                      <span className="font-mono">{d.code}</span>
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedDiagnoses.length > 0 && (
                <div className="rounded-xl bg-cyan-50 p-3">
                  <p className="mb-1 text-xs font-semibold text-cyan-700">
                    Dipilih ({selectedDiagnoses.length}):
                  </p>
                  <p className="text-sm text-cyan-900">
                    {selectedDiagnoses.map((d) => `${d.code} – ${d.label}`).join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Tindakan */}
            <div className="card rounded-2xl p-5">
              <p className="section-label mb-3">Tindakan Medis</p>
              <input
                value={procedureText}
                onChange={(e) => setProcedureText(e.target.value)}
                placeholder="Pisahkan dengan koma — mis: Nebulizer, Pemeriksaan gula darah"
                className="input-base"
              />
            </div>
          </div>

          {/* Right: Notes */}
          <div className="flex flex-col rounded-2xl card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
              <MessageCircle className="h-4 w-4 text-cyan-600" />
              <p className="font-semibold text-ink text-sm">Catatan Perawat ↔ Dokter</p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {visit.notes.length === 0 && (
                <p className="text-center text-sm text-muted pt-4">Belum ada catatan.</p>
              )}
              {visit.notes.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl px-3 py-2.5 text-sm ${
                    n.priority === "prioritas"
                      ? "bg-danger-100 text-danger-700"
                      : n.author === (user?.name ?? "")
                      ? "ml-4 bg-cyan-500 text-white"
                      : "mr-4 bg-paper text-ink/80"
                  }`}
                >
                  <p className="mb-0.5 text-xs font-semibold opacity-70">
                    {n.author} · {n.createdAt}
                  </p>
                  {n.message}
                </div>
              ))}
            </div>
            <div className="border-t border-line p-3 flex gap-2">
              <input
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
                placeholder="Tulis catatan..."
                className="input-base flex-1 text-xs"
              />
              <button
                onClick={handleReply}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
