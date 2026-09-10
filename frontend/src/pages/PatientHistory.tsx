import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { useClinic } from "../context/ClinicContext";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, visits } = useClinic();

  const patient = patients.find((p) => p.id === id);
  const patientVisits = visits
    .filter((v) => v.patientId === id)
    .sort((a, b) => b.checkInTime.localeCompare(a.checkInTime));

  if (!patient) {
    return (
      <AppShell>
        <div className="p-8 text-sm text-muted">Pasien tidak ditemukan.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl p-8">
        <button
          onClick={() => navigate("/pasien")}
          className="mb-4 text-xs font-medium text-teal-700 hover:underline"
        >
          ← Kembali ke Daftar Pasien
        </button>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {patient.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          NIK {patient.nik} · {patient.phone}
        </p>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Riwayat Kunjungan
          </p>
          <div className="space-y-3 border-l-2 border-line pl-5">
            {patientVisits.map((v) => (
              <div key={v.id} className="relative rounded-lg bg-white shadow-soft p-4">
                <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border-2 border-teal-700 bg-white" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">
                    {v.checkInTime} · Antrian #{v.queueNumber}
                  </p>
                  <StatusBadge status={v.status} />
                </div>
                {v.anamnesis && (
                  <p className="mt-2 text-sm text-ink/80">{v.anamnesis}</p>
                )}
                {v.diagnoses && v.diagnoses.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {v.diagnoses.map((d) => (
                      <span
                        key={d.code}
                        className="rounded-sm bg-teal-100 px-2 py-0.5 text-xs text-teal-900"
                      >
                        {d.code} · {d.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {patientVisits.length === 0 && (
              <p className="rounded-lg border border-dashed border-line bg-white px-4 py-6 text-sm text-muted">
                Belum ada riwayat kunjungan.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
