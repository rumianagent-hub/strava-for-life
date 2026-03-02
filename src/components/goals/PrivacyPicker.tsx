"use client";

import type { GoalPrivacy } from "@/lib/schemas";

interface PrivacyPickerProps {
  value: GoalPrivacy;
  onChange: (privacy: GoalPrivacy) => void;
}

export function PrivacyPicker({ value, onChange }: PrivacyPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Goal privacy">
      <button
        type="button"
        role="radio"
        aria-checked={value === "private"}
        onClick={() => onChange("private")}
        className={`p-3 rounded-xl text-left transition-all ${
          value === "private"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="font-medium text-sm">{"\u{1F512}"} Private</div>
        <div className={`text-xs mt-0.5 ${value === "private" ? "text-gray-300" : "text-gray-500"}`}>
          Only you can see this
        </div>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "squad"}
        onClick={() => onChange("squad")}
        className={`p-3 rounded-xl text-left transition-all ${
          value === "squad"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="font-medium text-sm">{"\u{1F465}"} Squad</div>
        <div className={`text-xs mt-0.5 ${value === "squad" ? "text-gray-300" : "text-gray-500"}`}>
          Visible to squad members
        </div>
      </button>
    </div>
  );
}
