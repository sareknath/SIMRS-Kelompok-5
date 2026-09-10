import {
  Users,
  Clock,
  Stethoscope,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import PatientAvatar from "../components/PatientAvatar";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";

function calcAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function Dashboard() {
  const { visits, patients, getPatient } = useClinic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const menunggu = visits.filter((v) => v.status === "menunggu_perawat").length;
  const siap = visits.filter((v) => v.status === "siap_diperiksa").length;
  const diperiksa = visits.filter((v) => v.status === "sedang_diperiksa").length;
  const selesai = visits.filter((v) => v.status === "selesai").length;

  const stats = [
    {
      label: "Total Pasien",
      value: patients.length,
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
    },
    {
      label: "Menunggu Perawat",
      value: menunggu,
      icon: Clock,
      color: "text-warning-600",
      bg: "bg-warning-100",
      border: "border-yellow-100",
    },
    {
      label: "Siap Diperiksa",
      value: siap,
      icon: Stethoscope,
      color: "text-primary-600",
      bg: "bg-primary-100",
      border: "border-blue-100",
    },
    {
      label: "Selesai Hari Ini",
      value: selesai,
      icon: CheckCircle2,
      color: "text-success-600",
      bg: "bg-success-100",
      border: "border-green-100",
    },
  ];

  const flowSteps = [
    { label: "Daftar", value: visits.length, color: "#64748b" },
    { label: "Perawat", value: menunggu, color: "#f59e0b" },
    { label: "Siap", value: siap, color: "#06b6d4" },
    { label: "Periksa", value: diperiksa, color: "#3b82f6" },
    { label: "Selesai", value: selesai, color: "#10b981" },
  ];

  const recentVisits = [...visits]
    .sort((a, b) => a.queueNumber - b.queueNumber)
    .slice(0, 5);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-muted">Selamat datang kembali,</p>
          <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">
            {user?.name} 👋
          </h1>
        </div>

        {/* Hero Card */}
        <div
          className="mb-6 relative overflow-hidden rounded-2xl p-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, #022c34 0%, #0a6980 55%, #0ea5c9 100%)",
            boxShadow: "0 8px 32px rgba(2,44,52,0.25)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #67e8f9, transparent)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-24 h-32 w-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }}
          />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-cyan-200/70">
                <CalendarDays className="h-4 w-4" />
                Kunjungan Hari Ini
              </div>
              <p className="font-display text-5xl font-bold">
                {visits.length}
                <span className="ml-2 text-xl font-medium text-cyan-200/60">
                  pasien
                </span>
              </p>
            </div>

            <div className="flex gap-6 text-center">
              {[
                { label: "Sedang Diperiksa", val: diperiksa, color: "text-cyan-300" },
                { label: "Selesai", val: selesai, color: "text-teal-300" },
                { label: "Total Pasien", val: patients.length, color: "text-white" },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`font-display text-2xl font-bold ${s.color}`}>
                    {s.val}
                  </p>
                  <p className="mt-0.5 text-xs text-cyan-100/50">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2">
              <Activity className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-medium text-cyan-100">
                Sistem Aktif
              </span>
              <TrendingUp className="h-4 w-4 text-teal-300" />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`card group cursor-default rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card ${s.border}`}
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
              >
                <s.icon className={`h-5 w-5 ${s.color}`} strokeWidth={2} />
              </div>
              <p className="font-display text-3xl font-bold text-ink">{s.value}</p>
              <p className="mt-0.5 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Flow visual */}
          <div className="card rounded-2xl p-6 lg:col-span-1">
            <p className="mb-5 font-semibold text-ink">Alur Pasien Hari Ini</p>
            <div className="space-y-3">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.value}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">
                        {step.label}
                      </span>
                      <span className="text-xs text-muted">{step.value} pasien</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-paper">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: visits.length > 0
                            ? `${(step.value / visits.length) * 100}%`
                            : "0%",
                          backgroundColor: step.color,
                        }}
                      />
                    </div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="absolute left-10 mt-6" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent visits table */}
          <div className="card rounded-2xl lg:col-span-2">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="font-semibold text-ink">Kunjungan Hari Ini</p>
              <button
                onClick={() => navigate("/pasien")}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
              >
                Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="divide-y divide-line">
              {recentVisits.map((v) => {
                const patient = getPatient(v.patientId);
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-paper"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                      #{v.queueNumber}
                    </div>
                    <PatientAvatar name={patient?.name ?? "?"} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {patient?.name}
                      </p>
                      <p className="text-xs text-muted">
                        {patient
                          ? `${calcAge(patient.birthDate)} th · Check-in ${v.checkInTime}`
                          : v.checkInTime}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
