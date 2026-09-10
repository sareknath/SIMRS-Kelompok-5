import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
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

  // Mode: if visitId present -> dokter buat resep baru. Else -> apoteker lihat semua resep.
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

    const updateItem = (id: string, field: keyof PrescriptionItem, value: string | number) => {
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
        <div className="mx-auto max-w-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Buat Resep — {patient.name}
          </h1>

          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 rounded-lg bg-white shadow-soft p-3"
              >
                <input
                  placeholder="Nama obat"
                  value={item.drugName}
                  onChange={(e) => updateItem(item.id, "drugName", e.target.value)}
                  className="col-span-4 rounded-sm border border-line px-2 py-1.5 text-sm outline-none focus:border-amber-500"
                />
                <input
                  placeholder="Dosis (mis. 1 tablet)"
                  value={item.dosage}
                  onChange={(e) => updateItem(item.id, "dosage", e.target.value)}
                  className="col-span-3 rounded-sm border border-line px-2 py-1.5 text-sm outline-none focus:border-amber-500"
                />
                <input
                  placeholder="Aturan pakai"
                  value={item.frequency}
                  onChange={(e) => updateItem(item.id, "frequency", e.target.value)}
                  className="col-span-3 rounded-sm border border-line px-2 py-1.5 text-sm outline-none focus:border-amber-500"
                />
                <input
                  type="number"
                  placeholder="Jml"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", Number(e.target.value))
                  }
                  className="col-span-1 rounded-sm border border-line px-2 py-1.5 text-sm outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => removeRow(item.id)}
                  className="col-span-1 text-xs text-brick-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={addRow}
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              + Tambah obat
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => navigate(`/kunjungan/${visit.id}`)}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full bg-teal-900 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Simpan Resep
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Apoteker view — list all prescriptions
  return (
    <AppShell>
      <div className="p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Resep</h1>
        <p className="mt-1 text-sm text-muted">
          Daftar resep dari dokter, tandai setelah diserahkan ke pasien.
        </p>

        <div className="mt-6 space-y-3">
          {prescriptions.map((rx) => {
            const visit = visits.find((v) => v.id === rx.visitId);
            const patient = visit ? getPatient(visit.patientId) : undefined;
            return (
              <div
                key={rx.id}
                className="rounded-lg bg-white shadow-soft p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base font-semibold text-ink">
                      {patient?.name ?? "Pasien"}
                    </p>
                    <p className="text-xs text-muted">
                      Diresepkan oleh {rx.createdBy} · {rx.createdAt}
                    </p>
                  </div>
                  {rx.dispensed ? (
                    <span className="rounded-sm bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
                      Sudah Diserahkan
                    </span>
                  ) : (
                    <span className="rounded-sm bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-600">
                      Menunggu
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {rx.items.map((it) => (
                    <li key={it.id} className="text-ink/80">
                      <span className="font-medium">{it.drugName}</span> —{" "}
                      {it.dosage}, {it.frequency} ({it.quantity} pcs)
                    </li>
                  ))}
                </ul>
                {!rx.dispensed && (
                  <button
                    onClick={() => dispensePrescription(rx.id)}
                    className="mt-3 rounded-full bg-teal-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                  >
                    Tandai Sudah Diserahkan
                  </button>
                )}
              </div>
            );
          })}
          {prescriptions.length === 0 && (
            <p className="rounded-lg border border-dashed border-line bg-white px-5 py-8 text-center text-sm text-muted">
              Belum ada resep.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
