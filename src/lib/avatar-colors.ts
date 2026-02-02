const AVATAR_COLORS = [
  { frame: "bg-green-400", bg: "bg-green-100 text-green-800", hex: "4ade80" },
  { frame: "bg-pink-400", bg: "bg-pink-100 text-pink-800", hex: "f472b6" },
  { frame: "bg-amber-400", bg: "bg-amber-100 text-amber-800", hex: "fbbf24" },
  { frame: "bg-blue-400", bg: "bg-blue-100 text-blue-800", hex: "60a5fa" },
  { frame: "bg-violet-400", bg: "bg-violet-100 text-violet-800", hex: "a78bfa" },
  { frame: "bg-rose-400", bg: "bg-rose-100 text-rose-800", hex: "fb7185" },
  { frame: "bg-teal-400", bg: "bg-teal-100 text-teal-800", hex: "2dd4bf" },
  { frame: "bg-orange-400", bg: "bg-orange-100 text-orange-800", hex: "fb923c" },
] as const;

export function getAvatarColor(contactId: string) {
  let hash = 0;
  for (let i = 0; i < contactId.length; i++) {
    hash = (hash << 5) - hash + contactId.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
