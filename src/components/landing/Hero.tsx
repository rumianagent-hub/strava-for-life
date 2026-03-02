"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function Hero() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/app");
    }
  }, [user, loading, router]);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
      <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
        <Flame className="w-4 h-4" />
        Build streaks. Stay accountable.
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
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
  );
}
