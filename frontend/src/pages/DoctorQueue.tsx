import { useNavigate } from "react-router-dom";
import { Stethoscope, AlertTriangle, Play, ChevronRight } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import PatientAvatar from "../components/PatientAvatar";
import QueueToast from "../components/QueueToast";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";

function VitalChip({ label, value, abnormal }: { label: string; value: string; abnormal?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl px-3 py-2 text-center ${
        abnormal ? "bg-danger-100 text-danger-600" : "bg-paper text-ink"
      }`}
    >
      <span className={`text-[10px] font-medium ${abnormal ? "text-danger-500" : "text-muted"}`}>
        {label}
      </span>
      <span className={`mt-0.5 font-mono text-sm font-bold ${abnormal ? "text-danger-600" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}

export default function DoctorQueue() {
  const { visits, getPatient, startExamine } = useClinic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const waiting = visits
    .filter((v) => v.status === "siap_diperiksa")
    .sort((a, b) => a.queueNumber - b.queueNumber);

  const inProgress = visits.filter(
    (v) =>
      v.status === "sedang_diperiksa" &&
      v.assignedDoctor === (user?.name ?? "")
  );

  const handleStart = (visitId: string) => {
    startExamine(visitId, user?.name ?? "Dokter");
    navigate(`/kunjungan/${visitId}`);
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
            <Stethoscope className="h-5 w-5 text-primary-600" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Antrian Saya</h1>
            <p className="text-sm text-muted">
              Pasien yang sudah dicek perawat dan siap diperiksa akan otomatis muncul di sini.
            </p>
          </div>
        </div>

        {/* In-progress */}
        {inProgress.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-3">Sedang Anda Periksa</p>
            <div className="space-y-3">
              {inProgress.map((v) => {
                const patient = getPatient(v.patientId);
                return (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/kunjungan/${v.id}`)}
                    className="flex w-full items-center gap-4 rounded-2xl border-2 border-primary-500/40 bg-gradient-to-r from-primary-50 to-blue-50 px-5 py-4 text-left transition-all hover:border-primary-500 hover:shadow-soft"
                  >
                    <PatientAvatar name={patient?.name ?? "?"} size="md" />
                    <div className="flex-1">
                      <p className="font-semibold text-ink">
                        #{v.queueNumber} {patient?.name}
                      </p>
                      <p className="text-xs text-muted">Sedang diperiksa</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                      Lanjutkan <ChevronRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Waiting queue */}
        <div>
          <p className="section-label mb-3">
            Menunggu Diperiksa ({waiting.length})
          </p>
          {waiting.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white py-16 text-center">
              <Stethoscope className="mb-4 h-12 w-12 text-line" strokeWidth={1.5} />
              <p className="font-semibold text-ink">Antrian Kosong</p>
              <p className="mt-1 max-w-xs text-sm text-muted">
                Belum ada pasien yang siap diperiksa. Antrian akan muncul otomatis begitu perawat menandai pasien siap.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {waiting.map((v) => {
                const patient = getPatient(v.patientId);
                const isPriority = v.notes.some((n) => n.priority === "prioritas");
                const vs = v.vitalSign;

                return (
                  <div
                    key={v.id}
                    className={`card rounded-2xl p-5 transition-all hover:shadow-card ${
                      isPriority ? "border-l-4 border-l-danger-500" : ""
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={patient?.name ?? "?"} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-display font-bold text-ink">
                              #{v.queueNumber} {patient?.name}
                            </p>
                            {isPriority && (
                              <span className="flex items-center gap-1 rounded-full bg-danger-100 px-2 py-0.5 text-xs font-bold text-danger-600">
                                <AlertTriangle className="h-3 w-3" />
                                Prioritas
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted">
                            Check-in {v.checkInTime}
                            {vs && ` · Dicek oleh ${vs.recordedBy}`}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>

                    {/* Vital summary */}
                    {vs && (
                      <div className="mb-4 grid grid-cols-5 gap-2">
                        <VitalChip
                          label="TD"
                          value={`${vs.systolic}/${vs.diastolic}`}
                          abnormal={vs.systolic > 140 || vs.diastolic > 90}
                        />
                        <VitalChip
                          label="Nadi"
                          value={`${vs.pulse}/mnt`}
                          abnormal={vs.pulse > 100 || vs.pulse < 60}
                        />
                        <VitalChip
                          label="Suhu"
                          value={`${vs.temperature}°C`}
                          abnormal={vs.temperature > 37.5}
                        />
                        <VitalChip
                          label="SpO2"
                          value={`${vs.spo2}%`}
                          abnormal={vs.spo2 < 95}
                        />
                        <VitalChip
                          label="Napas"
                          value={`${vs.respRate}/mnt`}
                          abnormal={vs.respRate > 20}
                        />
                      </div>
                    )}

                    {/* Nurse notes */}
                    {v.notes.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {v.notes.map((n) => (
                          <div
                            key={n.id}
                            className={`rounded-xl px-3 py-2.5 text-sm ${
                              n.priority === "prioritas"
                                ? "bg-danger-100 text-danger-700"
                                : "bg-paper text-ink/80"
                            }`}
                          >
                            <span className="font-semibold">{n.author}:</span>{" "}
                            {n.message}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleStart(v.id)}
                      className="btn-primary flex w-full items-center justify-center gap-2 py-3"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                      Mulai Periksa
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <QueueToast />
    </AppShell>
  );
}
