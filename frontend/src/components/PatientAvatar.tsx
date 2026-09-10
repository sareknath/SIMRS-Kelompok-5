const palette = [
  { bg: "#0F3D3E", fg: "#EAF4F3" }, // teal
  { bg: "#B9781F", fg: "#FCF1DF" }, // amber
  { bg: "#5B4636", fg: "#F1E9E1" }, // brown
  { bg: "#3D5A80", fg: "#E7EEF5" }, // slate blue
  { bg: "#7A5C61", fg: "#F3E9EA" }, // mauve
];

function hashName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function PatientAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const colors = palette[hashName(name) % palette.length];
  const dims =
    size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-display font-semibold ${dims}`}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      {initials}
    </div>
  );
}
