import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Pill, Plus, Trash2, Save, Package } from "lucide-react";
import AppShell from "../components/AppShell";
import PatientAvatar from "../components/PatientAvatar";
import { useClinic } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";
import type { PrescriptionItem } from "../types";

const emptyItem = (): PrescriptionItem => ({
  id: `tmp${Date.now()}`,
  drugName: "",
  dosage: "",
  frequency: "",
  quantity: 1,
});

export default function PrescriptionPage() {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visits, getPatient, prescriptions, addPrescription, dispensePrescription } =
    useClinic();
  const [items, setItems] = useState<PrescriptionItem[]>([emptyItem()]);

  // ── Dokter mode: buat resep baru ──
  if (visitId) {
    const visit = visits.find((v) => v.id === visitId);
    const patient = visit ? getPatient(visit.patientId) : undefined;

    if (!visit || !patient) {
      return (
        <AppShell>
          <div className="p-8 text-sm text-muted">Kunjungan tidak ditemukan.</div>
        </AppShell>
      );
    }

    const updateItem = (
      id: string,
      field: keyof PrescriptionItem,
      value: string | number
    ) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
      );
    };

    const addRow = () => setItems((prev) => [...prev, emptyItem()]);
    const removeRow = (id: string) =>
      setItems((prev) => prev.filter((it) => it.id !== id));

    const handleSubmit = () => {
      const validItems = items.filter((it) => it.drugName.trim());
      if (validItems.length === 0) return;
      addPrescription(visit.id, validItems, user?.name ?? "Dokter");
      navigate(`/kunjungan/${visit.id}`);
    };

    return (
      <AppShell>
        <div className="mx-auto max-w-3xl p-6 lg:p-8 animate-fade-in">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(`/kunjungan/${visit.id}`)}
            className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-cyan-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Rekam Medis
          </button>

          {/* Header */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-primary-50 to-cyan-50 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <Pill className="h-6 w-6 text-primary-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-ink">
                Buat Resep Obat
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <PatientAvatar name={patient.name} size="sm" />
                <span className="text-sm font-semibold text-ink">
                  {patient.name}
                </span>
                <span className="text-xs text-muted">· Antrian #{visit.queueNumber}</span>
              </div>
            </div>
          </div>

          {/* Prescription table */}
          <div className="card mb-5 overflow-hidden rounded-2xl">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 border-b border-line bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              <div className="col-span-4">Nama Obat</div>
              <div className="col-span-3">Dosis</div>
              <div className="col-span-3">Aturan Pakai</div>
              <div className="col-span-1 text-center">Jml</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-line">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2 px-4 py-3"
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                      {idx + 1}
                    </span>
                    <input
                      placeholder="Nama obat"
                      value={item.drugName}
                      onChange={(e) =>
                        updateItem(item.id, "drugName", e.target.value)
                      }
                      className="input-base"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      placeholder="mis. 1 tablet"
                      value={item.dosage}
                      onChange={(e) =>
                        updateItem(item.id, "dosage", e.target.value)
                      }
                      className="input-base"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      placeholder="mis. 2x sehari"
                      value={item.frequency}
                      onChange={(e) =>
                        updateItem(item.id, "frequency", e.target.value)
                      }
                      className="input-base"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Number(e.target.value))
                      }
                      className="input-base text-center font-mono"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeRow(item.id)}
                      disabled={items.length === 1}
                      className="rounded-lg p-1.5 text-muted hover:bg-danger-100 hover:text-danger-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add row */}
            <div className="border-t border-line px-4 py-3">
              <button
                onClick={addRow}
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Obat
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(`/kunjungan/${visit.id}`)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Simpan Resep
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Apoteker mode: lihat semua resep ──
  const pending = prescriptions.filter((rx) => !rx.dispensed);
  const done = prescriptions.filter((rx) => rx.dispensed);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100">
            <Package className="h-5 w-5 text-warning-600" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Resep Obat</h1>
            <p className="text-sm text-muted">
              Daftar resep dari dokter — tandai setelah diserahkan ke pasien.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="card rounded-2xl p-4">
            <p className="text-3xl font-bold text-ink">{prescriptions.length}</p>
            <p className="text-sm text-muted">Total Resep</p>
          </div>
          <div className="card rounded-2xl border-warning-100 border p-4">
            <p className="text-3xl font-bold text-warning-600">{pending.length}</p>
            <p className="text-sm text-muted">Menunggu</p>
          </div>
          <div className="card rounded-2xl border-success-100 border p-4">
            <p className="text-3xl font-bold text-success-600">{done.length}</p>
            <p className="text-sm text-muted">Sudah Diserahkan</p>
          </div>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-3">Menunggu Diserahkan ({pending.length})</p>
            <div className="space-y-3">
              {pending.map((rx) => {
                const visit = visits.find((v) => v.id === rx.visitId);
                const patient = visit ? getPatient(visit.patientId) : undefined;
                return (
                  <div
                    key={rx.id}
                    className="card rounded-2xl border-l-4 border-l-warning-500 p-5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {patient && <PatientAvatar name={patient.name} size="sm" />}
                        <div>
                          <p className="font-display font-bold text-ink">
                            {patient?.name ?? "Pasien"}
                          </p>
                          <p className="text-xs text-muted">
                            Diresepkan oleh {rx.createdBy} · {rx.createdAt}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full bg-warning-100 px-3 py-1 text-xs font-bold text-warning-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
                        Menunggu
                      </span>
                    </div>
                    <div className="mb-3 divide-y divide-line rounded-xl border border-line overflow-hidden">
                      {rx.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <Pill className="h-4 w-4 flex-shrink-0 text-muted" />
                          <span className="flex-1 font-semibold text-ink">{it.drugName}</span>
                          <span className="text-muted">{it.dosage}</span>
                          <span className="text-muted">{it.frequency}</span>
                          <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-xs font-bold text-ink">
                            ×{it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => dispensePrescription(rx.id)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Tandai Sudah Diserahkan
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done */}
        {done.length > 0 && (
          <div>
            <p className="section-label mb-3">Sudah Diserahkan ({done.length})</p>
            <div className="space-y-3">
              {done.map((rx) => {
                const visit = visits.find((v) => v.id === rx.visitId);
                const patient = visit ? getPatient(visit.patientId) : undefined;
                return (
                  <div key={rx.id} className="card rounded-2xl p-5 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {patient && <PatientAvatar name={patient.name} size="sm" />}
                        <div>
                          <p className="font-semibold text-ink">{patient?.name ?? "Pasien"}</p>
                          <p className="text-xs text-muted">
                            {rx.createdBy} · {rx.createdAt} · {rx.items.length} obat
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-xs font-bold text-success-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                        Sudah Diserahkan
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {prescriptions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white py-16 text-center">
            <Pill className="mb-4 h-12 w-12 text-line" strokeWidth={1.5} />
            <p className="font-semibold text-ink">Belum Ada Resep</p>
            <p className="mt-1 text-sm text-muted">
              Resep dari dokter akan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
