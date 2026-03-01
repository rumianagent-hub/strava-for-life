"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createGoal } from "@/lib/firestore";
import { GoalCategory, GoalPrivacy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: "health", label: "Health", emoji: "🥦" },
  { value: "fitness", label: "Fitness", emoji: "💪" },
  { value: "learning", label: "Learning", emoji: "📚" },
  { value: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { value: "productivity", label: "Productivity", emoji: "⚡" },
  { value: "social", label: "Social", emoji: "🤝" },
  { value: "creativity", label: "Creativity", emoji: "🎨" },
  { value: "other", label: "Other", emoji: "🎯" },
];

export default function NewGoalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("health");
  const [privacy, setPrivacy] = useState<GoalPrivacy>("private");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setSaving(true);
    try {
      const goalId = await createGoal(user.uid, {
        title: title.trim(),
        description: description.trim(),
        category,
        privacy,
      });
      toast.success("Goal created!");
      router.push(`/app/goals/${goalId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create goal");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/app"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl">Create a new goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Goal title *</Label>
              <Input
                id="title"
                placeholder="e.g. Read for 20 minutes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your goal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      category === cat.value
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-lg">{cat.emoji}</div>
                    <div className="text-xs mt-1 font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Privacy</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrivacy("private")}
                  className={`p-3 rounded-xl text-left transition-all ${
                    privacy === "private"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium text-sm">🔒 Private</div>
                  <div className={`text-xs mt-0.5 ${privacy === "private" ? "text-gray-300" : "text-gray-500"}`}>
                    Only you can see this
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy("squad")}
                  className={`p-3 rounded-xl text-left transition-all ${
                    privacy === "squad"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium text-sm">👥 Squad</div>
                  <div className={`text-xs mt-0.5 ${privacy === "squad" ? "text-gray-300" : "text-gray-500"}`}>
                    Visible to squad members
                  </div>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={saving || !title.trim()}
            >
              {saving ? "Creating..." : "Create Goal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
