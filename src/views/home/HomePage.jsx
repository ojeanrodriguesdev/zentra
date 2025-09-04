'use client';

import { Header } from '@/components/layout';
import { HeroSection } from '@/components/sections';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
    </div>
  );
}
