import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import {
  LayoutGrid,
  Users,
  ClipboardPlus,
  Stethoscope,
  Pill,
  LogOut,
  Cross,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useClinic } from "../context/ClinicContext";
import PatientAvatar from "./PatientAvatar";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  badgeKey?: "menunggu" | "siap" | "resepPending";
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navByRole: Record<string, NavGroup[]> = {
  admin: [
    {
      group: "Utama",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
        { to: "/pasien", label: "Data Pasien", icon: Users },
      ],
    },
  ],
  perawat: [
    {
      group: "Utama",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      ],
    },
    {
      group: "Layanan Klinis",
      items: [
        { to: "/pasien", label: "Data Pasien", icon: Users },
        {
          to: "/nurse-station",
          label: "Nurse Station",
          icon: ClipboardPlus,
          badgeKey: "menunggu",
        },
      ],
    },
  ],
  dokter: [
    {
      group: "Utama",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      ],
    },
    {
      group: "Layanan Klinis",
      items: [
        { to: "/pasien", label: "Data Pasien", icon: Users },
        {
          to: "/antrian-dokter",
          label: "Antrian Saya",
          icon: Stethoscope,
          badgeKey: "siap",
        },
      ],
    },
  ],
  apoteker: [
    {
      group: "Utama",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      ],
    },
    {
      group: "Farmasi",
      items: [
        {
          to: "/resep",
          label: "Resep Obat",
          icon: Pill,
          badgeKey: "resepPending",
        },
      ],
    },
  ],
};

const roleLabel: Record<string, string> = {
  admin: "Administrator",
  perawat: "Perawat",
  dokter: "Dokter",
  apoteker: "Apoteker",
};

const roleBadgeStyle: Record<string, string> = {
  admin: "bg-violet-500/20 text-violet-200",
  perawat: "bg-teal-400/20 text-teal-200",
  dokter: "bg-cyan-400/20 text-cyan-200",
  apoteker: "bg-amber-400/20 text-amber-200",
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { visits, prescriptions } = useClinic();

  if (!user) return <>{children}</>;

  const groups = navByRole[user.role] ?? [];

  const badges: Record<string, number> = {
    menunggu: visits.filter((v) => v.status === "menunggu_perawat").length,
    siap: visits.filter((v) => v.status === "siap_diperiksa").length,
    resepPending: prescriptions.filter((rx) => !rx.dispensed).length,
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-paper font-body text-ink">
      {/* ── Sidebar ── */}
      <aside
        className="flex w-64 flex-shrink-0 flex-col"
        style={{
          background: "linear-gradient(180deg, #022c34 0%, #064e5e 50%, #0a6980 100%)",
          margin: "12px 0 12px 12px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(2,44,52,0.3)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #0ea5c9, #067a94)",
              boxShadow: "0 4px 12px rgba(14,165,201,0.4)",
            }}
          >
            <Cross className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none text-white">
              Klinika
            </p>
            <p className="mt-1 text-[10px] font-medium text-teal-300/60 uppercase tracking-widest">
              SIMRS
            </p>
          </div>
        </div>

        {/* Live status indicator */}
        <div className="mx-5 mb-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <span className="live-dot" />
          <span className="text-xs text-teal-200/70 truncate">{today}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {groups.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-teal-300/40">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-white/15 text-white shadow-sm"
                            : "text-teal-100/60 hover:bg-white/8 hover:text-teal-100"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                              isActive
                                ? "bg-cyan-400/20"
                                : "group-hover:bg-white/10"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${isActive ? "text-cyan-300" : ""}`}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                          </div>
                          <span className="flex-1">{item.label}</span>
                          {isActive && (
                            <ChevronRight className="h-3.5 w-3.5 text-cyan-300/60" />
                          )}
                          {badgeCount > 0 && !isActive && (
                            <span
                              className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                              style={{ background: "#0ea5c9" }}
                            >
                              {badgeCount}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <PatientAvatar name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  roleBadgeStyle[user.role] ?? "bg-white/10 text-white/60"
                }`}
              >
                {roleLabel[user.role] ?? user.role}
              </span>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              title="Keluar"
              className="rounded-lg p-1.5 text-teal-300/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex flex-shrink-0 items-center justify-between border-b border-line bg-white px-8 py-4"
          style={{ borderBottom: "1px solid #e2eaf0" }}
        >
          <div />
          <div className="flex items-center gap-3">
            <button className="relative rounded-xl bg-paper p-2 text-muted transition-colors hover:bg-teal-50 hover:text-teal-700">
              <Bell className="h-4.5 w-4.5 h-5 w-5" strokeWidth={2} />
              {(badges.menunggu + badges.siap) > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: "#ef4444" }}
                >
                  {badges.menunggu + badges.siap}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-line" />
            <div className="flex items-center gap-2">
              <PatientAvatar name={user.name} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-xs text-muted">{roleLabel[user.role]}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
