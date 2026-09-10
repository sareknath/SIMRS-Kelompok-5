import { useClinic } from "../context/ClinicContext";

export default function QueueToast() {
  const { lastQueueEvent } = useClinic();

  if (!lastQueueEvent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-sm border border-teal-700 bg-teal-900 px-4 py-3 text-sm text-white shadow-lg animate-[fadeIn_0.2s_ease-out]">
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
      {lastQueueEvent}
    </div>
  );
}
