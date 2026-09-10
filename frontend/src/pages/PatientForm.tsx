import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, User, Save } from "lucide-react";
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

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger-500">*</span>}
      </label>
      {children}
    </div>
  );
}

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
      <div className="mx-auto max-w-2xl p-6 lg:p-8 animate-fade-in">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/pasien")}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-cyan-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Daftar Pasien
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
            <User className="h-5 w-5 text-cyan-700" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              {isEdit ? "Ubah Data Pasien" : "Pendaftaran Pasien Baru"}
            </h1>
            <p className="text-sm text-muted">
              {isEdit
                ? "Perbarui informasi data pasien di bawah ini"
                : "Isi formulir pendaftaran pasien baru"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card rounded-2xl p-6">
          {/* Section: Identitas */}
          <div className="mb-6">
            <p className="section-label mb-4">Identitas Pasien</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Nama Lengkap" required>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-base"
                    placeholder="Contoh: Ahmad Fauzi"
                  />
                </FormField>
              </div>

              <FormField label="NIK" required>
                <input
                  value={form.nik}
                  onChange={(e) => handleChange("nik", e.target.value)}
                  maxLength={16}
                  className="input-base font-mono"
                  placeholder="16 digit NIK"
                />
              </FormField>

              <FormField label="Tanggal Lahir" required>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  className="input-base"
                />
              </FormField>

              <FormField label="Jenis Kelamin">
                <div className="flex gap-3">
                  {(["L", "P"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleChange("gender", g)}
                      className={`flex flex-1 items-center justify-center rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                        form.gender === g
                          ? g === "L"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-pink-400 bg-pink-50 text-pink-600"
                          : "border-line bg-white text-muted hover:border-slate-300"
                      }`}
                    >
                      {g === "L" ? "♂ Laki-laki" : "♀ Perempuan"}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-line" />

          {/* Section: Kontak */}
          <div className="mb-6">
            <p className="section-label mb-4">Informasi Kontak</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="No. Telepon">
                <input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="input-base"
                  placeholder="08xxxxxxxxxx"
                />
              </FormField>

              <div className="col-span-2">
                <FormField label="Alamat Lengkap">
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={2}
                    className="input-base resize-none"
                    placeholder="Jl. Contoh No. 1, Kecamatan, Kota"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-line pt-5">
            <button
              onClick={() => navigate("/pasien")}
              className="btn-secondary"
            >
              Batal
            </button>
            <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isEdit ? "Simpan Perubahan" : "Daftarkan Pasien"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
