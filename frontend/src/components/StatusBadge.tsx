const statusConfig: Record<
  string,
  { label: string; dot: string; bg: string; text: string }
> = {
  menunggu_perawat: {
    label: "Menunggu Perawat",
    dot: "#f59e0b",
    bg: "bg-warning-100",
    text: "text-warning-600",
  },
  siap_diperiksa: {
    label: "Siap Diperiksa",
    dot: "#06b6d4",
    bg: "bg-cyan-100",
    text: "text-cyan-700",
  },
  sedang_diperiksa: {
    label: "Sedang Diperiksa",
    dot: "#3b82f6",
    bg: "bg-primary-100",
    text: "text-primary-700",
  },
  selesai: {
    label: "Selesai",
    dot: "#10b981",
    bg: "bg-success-100",
    text: "text-success-600",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    label: status,
    dot: "#94a3b8",
    bg: "bg-slate-100",
    text: "text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span
        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: cfg.dot, boxShadow: `0 0 4px ${cfg.dot}` }}
      />
      {cfg.label}
    </span>
  );
}
