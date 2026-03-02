"use client";

import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
