import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, FileText, Activity } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import PatientAvatar from "../components/PatientAvatar";
import { useClinic } from "../context/ClinicContext";

function calcAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

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
      <div className="mx-auto max-w-3xl p-6 lg:p-8 animate-fade-in">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/pasien")}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-cyan-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Daftar Pasien
        </button>

        {/* Patient card */}
        <div className="mb-6 card rounded-2xl overflow-hidden">
          <div
            className="flex items-center gap-4 p-5"
            style={{
              background:
                "linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #e0f2fe 100%)",
            }}
          >
            <PatientAvatar name={patient.name} size="lg" />
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-ink">
                {patient.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                NIK: <span className="font-mono">{patient.nik}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
            <div className="px-5 py-3 text-center">
              <p className="text-lg font-bold text-ink">{calcAge(patient.birthDate)}</p>
              <p className="text-xs text-muted">Tahun</p>
            </div>
            <div className="px-5 py-3 text-center">
              <p className="text-lg font-bold text-ink">
                {patient.gender === "L" ? "♂ Laki-laki" : "♀ Perempuan"}
              </p>
              <p className="text-xs text-muted">Jenis Kelamin</p>
            </div>
            <div className="px-5 py-3 text-center">
              <p className="text-lg font-bold text-ink">{patientVisits.length}</p>
              <p className="text-xs text-muted">Total Kunjungan</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="card rounded-xl p-4">
            <p className="text-xs text-muted">No. Telepon</p>
            <p className="mt-0.5 font-semibold text-ink">{patient.phone}</p>
          </div>
          <div className="card rounded-xl p-4">
            <p className="text-xs text-muted">Alamat</p>
            <p className="mt-0.5 truncate font-semibold text-ink">
              {patient.address}
            </p>
          </div>
        </div>

        {/* Visit history timeline */}
        <p className="section-label mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-600" />
          Riwayat Kunjungan
        </p>

        {patientVisits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white py-12 text-center">
            <Calendar className="mb-3 h-10 w-10 text-line" />
            <p className="font-semibold text-ink">Belum Ada Kunjungan</p>
            <p className="mt-1 text-sm text-muted">
              Pasien ini belum memiliki riwayat kunjungan.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-line" />

            <div className="space-y-4">
              {patientVisits.map((v, idx) => (
                <div key={v.id} className="relative pl-12">
                  {/* Dot */}
                  <div
                    className={`absolute left-1 top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow ${
                      v.status === "selesai"
                        ? "bg-success-500"
                        : v.status === "sedang_diperiksa"
                        ? "bg-primary-500"
                        : v.status === "siap_diperiksa"
                        ? "bg-cyan-500"
                        : "bg-warning-500"
                    }`}
                  >
                    {patientVisits.length - idx}
                  </div>

                  <div className="card rounded-2xl p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Check-in {v.checkInTime} · Antrian #{v.queueNumber}
                        </span>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>

                    {v.anamnesis && (
                      <div className="mb-3">
                        <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted">
                          <FileText className="h-3.5 w-3.5" />
                          Anamnesis
                        </p>
                        <p className="text-sm text-ink/80">{v.anamnesis}</p>
                      </div>
                    )}

                    {v.diagnoses && v.diagnoses.length > 0 && (
                      <div className="mb-3">
                        <p className="mb-1.5 text-xs font-semibold text-muted">Diagnosis</p>
                        <div className="flex flex-wrap gap-1.5">
                          {v.diagnoses.map((d) => (
                            <span
                              key={d.code}
                              className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800"
                            >
                              {d.code} · {d.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {v.procedures && v.procedures.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-semibold text-muted">Tindakan</p>
                        <div className="flex flex-wrap gap-1.5">
                          {v.procedures.map((proc) => (
                            <span
                              key={proc}
                              className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-xs text-muted"
                            >
                              {proc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {v.vitalSign && (
                      <div className="mt-3 grid grid-cols-5 gap-1.5 rounded-xl bg-paper p-3">
                        {[
                          {
                            l: "TD",
                            v: `${v.vitalSign.systolic}/${v.vitalSign.diastolic}`,
                          },
                          { l: "Nadi", v: `${v.vitalSign.pulse}/mnt` },
                          { l: "Suhu", v: `${v.vitalSign.temperature}°C` },
                          { l: "SpO2", v: `${v.vitalSign.spo2}%` },
                          { l: "Napas", v: `${v.vitalSign.respRate}/mnt` },
                        ].map((item) => (
                          <div key={item.l} className="text-center">
                            <p className="text-[10px] text-muted">{item.l}</p>
                            <p className="font-mono text-xs font-bold text-ink">
                              {item.v}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
