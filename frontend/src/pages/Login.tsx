import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cross, User, Lock, Eye, EyeOff, Shield, Activity, Heart } from "lucide-react";
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

const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  perawat: "Perawat",
  dokter: "Dokter",
  apoteker: "Apoteker",
};

const roleColor: Record<Role, string> = {
  admin: "from-violet-500 to-purple-600",
  perawat: "from-emerald-400 to-teal-600",
  dokter: "from-cyan-400 to-blue-600",
  apoteker: "from-amber-400 to-orange-500",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (userId: string, role: Role) => {
    login(userId);
    navigate(roleLanding[role]);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #0f1c5e 0%, #1a3a8f 25%, #0e7fa8 60%, #6c3fa0 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Floating medical icons */}
      <div
        className="pointer-events-none absolute top-12 right-16 hidden opacity-20 lg:block"
        style={{ animation: "floatY 6s ease-in-out infinite" }}
      >
        <Heart className="h-8 w-8 text-cyan-300" strokeWidth={1.5} />
      </div>
      <div
        className="pointer-events-none absolute bottom-20 left-12 hidden opacity-20 lg:block"
        style={{ animation: "floatY 8s ease-in-out infinite 2s" }}
      >
        <Activity className="h-10 w-10 text-violet-300" strokeWidth={1.5} />
      </div>
      <div
        className="pointer-events-none absolute top-1/3 left-10 hidden opacity-15 lg:block"
        style={{ animation: "floatY 7s ease-in-out infinite 1s" }}
      >
        <Shield className="h-7 w-7 text-blue-300" strokeWidth={1.5} />
      </div>

      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-sm"
        style={{ animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        {/* Logo & Title */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
              boxShadow: "0 8px 32px rgba(14, 165, 233, 0.4)",
            }}
          >
            <Cross className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow">
            Klinika SIMRS
          </h1>
          <p className="mt-1 text-sm font-medium text-blue-200 opacity-80">
            Sistem Informasi Manajemen Rumah Sakit
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-7 shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {/* Username Field */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-100">
              Nama Pengguna
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <User className="h-4 w-4 text-blue-300 opacity-70" />
              </span>
              <input
                type="text"
                placeholder="Masukkan nama pengguna"
                defaultValue="siti.rahma"
                className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-blue-300/50 focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  // focus handled inline because Tailwind purge may not catch dynamic focus ring color
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(56,189,248,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-100">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <Lock className="h-4 w-4 text-blue-300 opacity-70" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                defaultValue="password"
                className="w-full rounded-xl py-2.5 pl-10 pr-11 text-sm text-white outline-none transition-all placeholder:text-blue-300/50"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(56,189,248,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3.5 flex items-center text-blue-300 opacity-70 transition-opacity hover:opacity-100"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Demo Role Selector */}
          <div
            className="mb-4 rounded-xl p-4"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200">
              <Shield className="h-3.5 w-3.5" />
              Masuk sebagai (mode demo)
            </p>
            <div className="space-y-2">
              {staffUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleLogin(u.id, u.role)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <PatientAvatar name={u.name} size="sm" />
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold text-white text-sm">
                      {u.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${roleColor[u.role]}`}
                      />
                      <span className="text-xs text-blue-300">
                        {roleLabel[u.role]}
                      </span>
                    </span>
                  </span>
                  <span className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100 text-xs">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-blue-300 opacity-60 leading-relaxed">
            Data ditampilkan menggunakan contoh / dummy
            <br />
            untuk keperluan tinjauan tampilan.
          </p>
        </div>

        {/* Bottom brand */}
        <p className="mt-5 text-center text-xs text-blue-300 opacity-40">
          © 2025 Klinika · SIMRS Kelompok 5
        </p>
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
