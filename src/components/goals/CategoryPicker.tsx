"use client";

import { GOAL_CATEGORIES, GOAL_CATEGORY_META, type GoalCategory } from "@/lib/constants";

interface CategoryPickerProps {
  value: GoalCategory;
  onChange: (category: GoalCategory) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Goal category">
      {GOAL_CATEGORIES.map((cat) => {
        const meta = GOAL_CATEGORY_META[cat];
        const selected = value === cat;
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(cat)}
            className={`p-3 rounded-xl text-center transition-all ${
              selected
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="text-lg">{meta.emoji}</div>
            <div className="text-xs mt-1 font-medium">{meta.label}</div>
          </button>
        );
      })}
    </div>
  );
}
