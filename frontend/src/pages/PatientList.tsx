import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileText, Pencil, Users } from "lucide-react";
import AppShell from "../components/AppShell";
import PatientAvatar from "../components/PatientAvatar";
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
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              Data Pasien
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Users className="h-4 w-4" />
              {patients.length} pasien terdaftar
            </p>
          </div>
          <button
            onClick={() => navigate("/pasien/baru")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Pasien
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-9"
          />
        </div>

        {/* Results info */}
        <p className="mb-3 text-xs text-muted">
          Menampilkan{" "}
          <span className="font-semibold text-ink">{filtered.length}</span> dari{" "}
          {patients.length} pasien
        </p>

        {/* Table */}
        <div className="card overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr
                className="border-b border-line text-xs uppercase tracking-wide"
                style={{ background: "#f8fafb" }}
              >
                {["Pasien", "NIK", "Usia / JK", "Kontak", "Alamat", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 font-semibold text-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`border-b border-line transition-colors last:border-0 hover:bg-cyan-50/40 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <PatientAvatar name={p.name} size="sm" />
                      <span className="font-semibold text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted">
                    {p.nik}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    <span className="font-medium text-ink">
                      {calcAge(p.birthDate)}
                    </span>{" "}
                    th /{" "}
                    <span
                      className={`font-semibold ${
                        p.gender === "L" ? "text-blue-600" : "text-pink-500"
                      }`}
                    >
                      {p.gender === "L" ? "L" : "P"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{p.phone}</td>
                  <td className="max-w-[160px] truncate px-5 py-3.5 text-xs text-muted">
                    {p.address}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/pasien/${p.id}/riwayat`)}
                        title="Riwayat"
                        className="flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Riwayat
                      </button>
                      <button
                        onClick={() => navigate(`/pasien/${p.id}/edit`)}
                        title="Ubah Data"
                        className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Ubah
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-10 w-10 text-line" />
                      <p className="text-sm text-muted">
                        Tidak ada pasien yang cocok dengan pencarian.
                      </p>
                      <button
                        onClick={() => setQuery("")}
                        className="text-xs font-semibold text-cyan-600 hover:underline"
                      >
                        Hapus filter
                      </button>
                    </div>
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
