"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame, Target, Users } from "lucide-react";

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/app");
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Flame className="w-4 h-4" />
          Build streaks. Stay accountable.
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Strava for Life
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10">
          Track your daily goals, build streaks, and stay motivated with friends
          in your squad.
        </p>

        <Button
          size="lg"
          onClick={signInWithGoogle}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base rounded-xl"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign in with Google"}
        </Button>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Daily Streaks</h3>
            <p className="text-sm text-gray-500">
              Check in every day to keep your streak alive. Miss a day and start
              over — just like Duolingo, but for life goals.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Goal Tracking</h3>
            <p className="text-sm text-gray-500">
              Create goals across health, fitness, learning, mindfulness and
              more. Track your progress with a visual calendar.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Squads</h3>
            <p className="text-sm text-gray-500">
              Invite up to 4 friends to your squad. Share goals, see each
              other&apos;s progress, and stay accountable together.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-400">
          Built with Next.js &amp; Firebase · Your data is private by default
        </p>
      </div>
    </main>
  );
}
