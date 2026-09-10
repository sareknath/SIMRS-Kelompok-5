import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useClinic } from "../context/ClinicContext";
import type { Patient } from "../types";

const emptyPatient = (): Patient => ({
  id: `p${Date.now()}`,
  name: "",
  nik: "",
  birthDate: "",
  gender: "L",
  phone: "",
  address: "",
});

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient } = useClinic();
  const isEdit = Boolean(id);
  const existing = patients.find((p) => p.id === id);
  const [form, setForm] = useState<Patient>(existing ?? emptyPatient());

  const handleChange = (field: keyof Patient, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isEdit) {
      updatePatient(form);
    } else {
      addPatient(form);
    }
    navigate("/pasien");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {isEdit ? "Ubah Data Pasien" : "Tambah Pasien Baru"}
        </h1>

        <div className="mt-6 space-y-4 rounded-lg bg-white shadow-soft p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="Contoh: Ahmad Fauzi"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">NIK</label>
              <input
                value={form.nik}
                onChange={(e) => handleChange("nik", e.target.value)}
                maxLength={16}
                className="w-full rounded-sm border border-line px-3 py-2 text-sm font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="16 digit NIK"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Jenis Kelamin
              </label>
              <select
                value={form.gender}
                onChange={(e) =>
                  handleChange("gender", e.target.value as "L" | "P")
                }
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                No. Telepon
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Alamat
              </label>
              <textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
                className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button
              onClick={() => navigate("/pasien")}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full bg-teal-900 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Simpan Data Pasien
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
