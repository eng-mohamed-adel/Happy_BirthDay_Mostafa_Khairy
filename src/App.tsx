/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ConfettiCanvas, ConfettiCanvasRef } from './components/ConfettiCanvas';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { EnvelopeCard } from './components/EnvelopeCard';
import { SparkleTrail } from './components/SparkleTrail';

export default function App() {
  const confettiRef = useRef<ConfettiCanvasRef | null>(null);

  const handleTriggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.burst(window.innerWidth / 2, window.innerHeight * 0.45, 110);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040814] text-slate-100 flex flex-col justify-between select-none">
      {/* Interactive Cursor / Touch Magic Sparkles */}
      <SparkleTrail />

      {/* Physics-based Celebration Confetti Explosion */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Dynamic Floating Balloons & Ambient Celebratory Lighting */}
      <BackgroundDecorations />

      {/* Main Focus: 3D Masculine Luxury Envelope & Card */}
      <section className="flex-1 flex items-center justify-center py-16 px-4 z-20">
        <EnvelopeCard triggerConfetti={handleTriggerConfetti} />
      </section>

      {/* Discreet Minimalist Footer Text */}
      <footer className="relative py-4 text-center z-20 text-[11px] text-slate-500/70 font-alexandria tracking-wider pointer-events-none">
        <span>مصطفى خيري · عيد ميلاد سعيد</span>
      </footer>
    </main>
  );
}
