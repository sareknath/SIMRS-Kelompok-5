import type { VisitStatus } from "../types";

const statusConfig: Record<
  VisitStatus,
  { label: string; className: string }
> = {
  menunggu_perawat: {
    label: "Menunggu Perawat",
    className: "bg-line/60 text-muted",
  },
  siap_diperiksa: {
    label: "Siap Diperiksa",
    className: "bg-amber-100 text-amber-600",
  },
  sedang_diperiksa: {
    label: "Sedang Diperiksa",
    className: "bg-teal-100 text-teal-700",
  },
  selesai: {
    label: "Selesai",
    className: "bg-teal-900/10 text-teal-900",
  },
};

export default function StatusBadge({ status }: { status: VisitStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium ${cfg.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}
