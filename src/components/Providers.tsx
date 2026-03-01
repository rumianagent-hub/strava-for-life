"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// Load AuthProvider with ssr:false so Firebase is never initialized server-side
const AuthProvider = dynamic(
  () => import("@/contexts/AuthContext").then((m) => m.AuthProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
