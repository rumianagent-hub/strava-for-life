"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </>
  );
}
