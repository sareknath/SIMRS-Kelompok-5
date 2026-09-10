import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useClinic } from "../context/ClinicContext";

function calcAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PatientList() {
  const { patients } = useClinic();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.nik.includes(query)
  );

  return (
    <AppShell>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Daftar Pasien
            </h1>
            <p className="mt-1 text-sm text-muted">
              {patients.length} pasien terdaftar
            </p>
          </div>
          <button
            onClick={() => navigate("/pasien/baru")}
            className="rounded-full bg-teal-900 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Tambah Pasien
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari nama atau NIK..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-5 w-full max-w-sm rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />

        <div className="mt-5 overflow-hidden rounded-lg bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">NIK</th>
                <th className="px-5 py-3 font-medium">Usia / JK</th>
                <th className="px-5 py-3 font-medium">Kontak</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">
                    {p.nik}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {calcAge(p.birthDate)} th / {p.gender}
                  </td>
                  <td className="px-5 py-3 text-muted">{p.phone}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => navigate(`/pasien/${p.id}/riwayat`)}
                      className="text-xs font-medium text-teal-700 hover:underline"
                    >
                      Riwayat
                    </button>
                    <button
                      onClick={() => navigate(`/pasien/${p.id}/edit`)}
                      className="ml-4 text-xs font-medium text-teal-700 hover:underline"
                    >
                      Ubah
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted">
                    Tidak ada pasien yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
