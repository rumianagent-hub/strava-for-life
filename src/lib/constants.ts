// ─── App-wide constants ──────────────────────────────────────────────────────

export const DEFAULT_TIMEZONE = "America/Montreal";
export const SQUAD_MAX_MEMBERS = 5;
export const SQUAD_INVITE_CODE_LENGTH = 8;
export const CHECKIN_HISTORY_DAYS = 14;
export const DATE_FORMAT = "yyyy-MM-dd";

// ─── Goal categories ─────────────────────────────────────────────────────────

export const GOAL_CATEGORIES = [
  "health",
  "fitness",
  "learning",
  "mindfulness",
  "productivity",
  "social",
  "creativity",
  "other",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_CATEGORY_META: Record<
  GoalCategory,
  { label: string; emoji: string; colorClass: string }
> = {
  health: { label: "Health", emoji: "\u{1F966}", colorClass: "bg-green-100 text-green-700" },
  fitness: { label: "Fitness", emoji: "\u{1F4AA}", colorClass: "bg-blue-100 text-blue-700" },
  learning: { label: "Learning", emoji: "\u{1F4DA}", colorClass: "bg-purple-100 text-purple-700" },
  mindfulness: { label: "Mindfulness", emoji: "\u{1F9D8}", colorClass: "bg-teal-100 text-teal-700" },
  productivity: { label: "Productivity", emoji: "\u26A1", colorClass: "bg-yellow-100 text-yellow-700" },
  social: { label: "Social", emoji: "\u{1F91D}", colorClass: "bg-pink-100 text-pink-700" },
  creativity: { label: "Creativity", emoji: "\u{1F3A8}", colorClass: "bg-orange-100 text-orange-700" },
  other: { label: "Other", emoji: "\u{1F3AF}", colorClass: "bg-gray-100 text-gray-700" },
};
