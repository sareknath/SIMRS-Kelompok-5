import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import QueueToast from "../components/QueueToast";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";

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
      <div className="p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Antrian Saya
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pasien yang sudah dicek perawat dan siap diperiksa akan otomatis
          muncul di sini.
        </p>

        {inProgress.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              Sedang Anda Periksa
            </p>
            <div className="space-y-2">
              {inProgress.map((v) => {
                const patient = getPatient(v.patientId);
                return (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/kunjungan/${v.id}`)}
                    className="flex w-full items-center justify-between rounded-lg border border-amber-500/30 bg-amber-100 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium">
                      #{v.queueNumber} {patient?.name}
                    </span>
                    <span className="text-xs text-teal-700">
                      Lanjutkan pemeriksaan
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Menunggu Diperiksa ({waiting.length})
          </p>
          <div className="space-y-3">
            {waiting.map((v) => {
              const patient = getPatient(v.patientId);
              const isPriority = v.notes.some(
                (n) => n.priority === "prioritas"
              );
              return (
                <div
                  key={v.id}
                  className={`rounded-lg bg-white px-5 py-4 shadow-soft ${
                    isPriority ? "border-l-4 border-brick-600" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-base font-semibold text-ink">
                          #{v.queueNumber} {patient?.name}
                        </p>
                        {isPriority && (
                          <span className="rounded-sm bg-brick-100 px-2 py-0.5 text-xs font-medium text-brick-600">
                            Prioritas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        Check-in {v.checkInTime} · Ditandai siap oleh{" "}
                        {v.vitalSign?.recordedBy}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>

                  {v.vitalSign && (
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-sm bg-paper p-3 text-xs sm:grid-cols-6">
                      <VitalTag label="TD" value={`${v.vitalSign.systolic}/${v.vitalSign.diastolic}`} />
                      <VitalTag label="Nadi" value={`${v.vitalSign.pulse}/mnt`} />
                      <VitalTag label="Suhu" value={`${v.vitalSign.temperature}°C`} />
                      <VitalTag label="SpO2" value={`${v.vitalSign.spo2}%`} />
                      <VitalTag label="Napas" value={`${v.vitalSign.respRate}/mnt`} />
                    </div>
                  )}

                  {v.notes.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {v.notes.map((n) => (
                        <p
                          key={n.id}
                          className={`rounded-sm px-3 py-2 text-sm ${
                            n.priority === "prioritas"
                              ? "bg-brick-100 text-brick-600"
                              : "bg-paper text-ink/80"
                          }`}
                        >
                          <span className="font-medium">{n.author}:</span>{" "}
                          {n.message}
                        </p>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleStart(v.id)}
                    className="mt-4 rounded-full bg-teal-900 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    Mulai Periksa
                  </button>
                </div>
              );
            })}
            {waiting.length === 0 && (
              <p className="rounded-lg border border-dashed border-line bg-white px-5 py-8 text-center text-sm text-muted">
                Belum ada pasien yang siap diperiksa. Antrian akan muncul
                otomatis begitu perawat menandai pasien siap.
              </p>
            )}
          </div>
        </div>
      </div>
      <QueueToast />
    </AppShell>
  );
}

function VitalTag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted">{label}</p>
      <p className="font-mono font-medium text-ink">{value}</p>
    </div>
  );
}
