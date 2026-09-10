import { useNavigate } from "react-router-dom";
import { Cross } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { staffUsers } from "../data/dummy";
import PatientAvatar from "../components/PatientAvatar";
import type { Role } from "../types";

const roleLanding: Record<Role, string> = {
  admin: "/dashboard",
  perawat: "/nurse-station",
  dokter: "/antrian-dokter",
  apoteker: "/resep",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (userId: string, role: Role) => {
    login(userId);
    navigate(roleLanding[role]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-950 shadow-soft">
            <Cross className="h-7 w-7 text-amber-500" strokeWidth={2.5} />
          </div>
          <p className="font-display text-2xl font-bold tracking-tight text-teal-950">
            Klinika
          </p>
          <p className="mt-1 text-sm text-muted">
            Sistem Rekam Medis Elektronik
          </p>
        </div>

        <div className="rounded-lg bg-white p-7 shadow-soft">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Nama Pengguna
          </label>
          <input
            type="text"
            placeholder="Masukkan nama pengguna"
            defaultValue="siti.rahma"
            className="mb-4 w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Kata Sandi
          </label>
          <input
            type="password"
            placeholder="••••••••"
            defaultValue="password"
            className="mb-6 w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />

          <p className="mb-3 text-xs font-medium text-muted">
            Masuk sebagai (mode demo)
          </p>
          <div className="space-y-2">
            {staffUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleLogin(u.id, u.role)}
                className="flex w-full items-center gap-3 rounded-full border border-line px-3 py-2 text-left text-sm transition-colors hover:border-amber-500 hover:bg-amber-100/60"
              >
                <PatientAvatar name={u.name} size="sm" />
                <span className="flex-1">
                  <span className="block font-medium text-ink">{u.name}</span>
                  <span className="text-xs capitalize text-muted">
                    {u.role}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          Data ditampilkan menggunakan contoh/dummy untuk keperluan tinjauan
          tampilan.
        </p>
      </div>
    </div>
  );
}
