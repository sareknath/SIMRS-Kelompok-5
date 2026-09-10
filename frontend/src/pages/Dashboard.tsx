import { Users, Clock, Stethoscope, CheckCircle2, CalendarDays } from "lucide-react";
import AppShell from "../components/AppShell";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { visits, patients } = useClinic();
  const { user } = useAuth();

  const menunggu = visits.filter((v) => v.status === "menunggu_perawat").length;
  const siap = visits.filter((v) => v.status === "siap_diperiksa").length;
  const diperiksa = visits.filter((v) => v.status === "sedang_diperiksa").length;
  const selesai = visits.filter((v) => v.status === "selesai").length;

  const stats = [
    { label: "Total Pasien", value: patients.length, icon: Users },
    { label: "Menunggu Perawat", value: menunggu, icon: Clock },
    { label: "Siap Diperiksa", value: siap, icon: Stethoscope },
    { label: "Selesai Hari Ini", value: selesai, icon: CheckCircle2 },
  ];

  return (
    <AppShell>
      <div className="p-8">
        <p className="text-sm text-muted">Selamat datang kembali,</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">
          {user?.name}
        </h1>

        {/* Hero card */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-teal-950 px-7 py-6 text-white shadow-soft">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-teal-100/70">
              <CalendarDays className="h-4 w-4" />
              Kunjungan hari ini
            </p>
            <p className="mt-2 font-display text-4xl font-bold">
              {visits.length}{" "}
              <span className="text-lg font-medium text-teal-100/60">pasien</span>
            </p>
          </div>
          <div className="hidden gap-6 text-center sm:flex">
            <div>
              <p className="font-display text-2xl font-bold text-amber-500">{diperiksa}</p>
              <p className="text-xs text-teal-100/60">sedang diperiksa</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{selesai}</p>
              <p className="text-xs text-teal-100/60">selesai</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-white px-5 py-5 shadow-soft"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <s.icon className="h-5 w-5 text-amber-600" strokeWidth={2} />
              </div>
              <p className="font-display text-2xl font-bold text-ink">
                {s.value}
              </p>
              <p className="mt-0.5 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-white p-6 shadow-soft">
          <p className="mb-5 text-sm font-semibold text-ink">
            Alur Kunjungan Pasien Hari Ini
          </p>
          <div className="flex items-center gap-0">
            {[
              { label: "Menunggu Perawat", value: menunggu },
              { label: "Siap Diperiksa", value: siap },
              { label: "Sedang Diperiksa", value: diperiksa },
              { label: "Selesai", value: selesai },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-display text-xl font-bold text-ink">
                    {step.value}
                  </span>
                  <span className="mt-1 text-xs text-muted">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px flex-1 bg-line" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
