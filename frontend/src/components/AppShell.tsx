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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PatientAvatar from "./PatientAvatar";

const navByRole: Record<
  string,
  { to: string; label: string; icon: typeof LayoutGrid }[]
> = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/pasien", label: "Daftar Pasien", icon: Users },
  ],
  perawat: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/pasien", label: "Daftar Pasien", icon: Users },
    { to: "/nurse-station", label: "Nurse Station", icon: ClipboardPlus },
  ],
  dokter: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/pasien", label: "Daftar Pasien", icon: Users },
    { to: "/antrian-dokter", label: "Antrian Saya", icon: Stethoscope },
  ],
  apoteker: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/resep", label: "Resep", icon: Pill },
  ],
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const links = navByRole[user.role] ?? [];

  return (
    <div className="flex min-h-screen bg-paper text-ink font-body">
      <aside className="flex w-64 flex-col bg-teal-950 m-3 mr-0 rounded-2xl">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
            <Cross className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-white">
              Klinika
            </p>
            <p className="mt-1.5 text-[11px] text-teal-100/50">
              Rekam Medis Elektronik
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 pt-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "text-teal-100/70 hover:bg-white/[0.06] hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
          <PatientAvatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="text-xs capitalize text-teal-100/50">{user.role}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            title="Keluar"
            className="rounded-lg p-1.5 text-teal-100/50 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
