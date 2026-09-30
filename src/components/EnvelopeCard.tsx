import React, { useState, useRef } from 'react';
import { birthdayAudio } from '../audio/birthdayAudio';

interface EnvelopeCardProps {
  triggerConfetti: () => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ triggerConfetti }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpeningPhase, setIsOpeningPhase] = useState<boolean>(false);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    if (!isOpen) {
      // Begin sequence
      setIsOpeningPhase(true);
      birthdayAudio.playUnsealSound();

      // Start celebratory birthday melody automatically
      if (!birthdayAudio.getIsPlaying()) {
        birthdayAudio.play();
      }

      // Step 2: Open flap & slide card
      setTimeout(() => {
        setIsOpen(true);
        setIsOpeningPhase(false);
        triggerConfetti();
        birthdayAudio.playConfettiPop();
      }, 550);
    } else {
      // Smoothly fold back
      setIsOpen(false);
    }
  };

  // Subtle 3D tilt tracking for lifelike physical presence
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 z-20"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Discreet, poetic hint that fades out once open */}
      <div
        className={`mb-6 transition-all duration-700 pointer-events-none select-none ${
          isOpen
            ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            : 'opacity-100 translate-y-0 animate-pulse'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-amber-500/40 shadow-[0_4px_25px_rgba(212,175,55,0.25)] backdrop-blur-md">
          <span className="text-amber-400 text-xs">✦</span>
          <span className="text-xs sm:text-sm font-alexandria text-amber-200 font-medium tracking-wide">
            اضغط علي الظرف
          </span>
          <span className="text-amber-400 text-xs">✦</span>
        </div>
      </div>

      {/* 3D Envelope Container with rounded edges & tilt */}
      <div
        onClick={handleToggle}
        className="relative w-full max-w-[420px] sm:max-w-[460px] h-[290px] sm:h-[315px] cursor-pointer select-none transition-transform duration-500 ease-out"
        style={{
          transform: isOpen
            ? 'rotateX(0deg) rotateY(0deg) scale(1)'
            : `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg) scale(1.02)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Envelope Outer Glow Shadow with matching rounded corners */}
        <div className="absolute -inset-3 rounded-[36px] bg-amber-500/10 blur-xl opacity-80 pointer-events-none" />

        {/* Envelope Back Plate (Rounded-3xl with gold border and arabesque lining) */}
        <div className="absolute inset-0 rounded-[32px] bg-[#070e1e] border-2 border-[#d4af37]/50 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* Ornate Gold Arabesque Wallpaper pattern inside */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 1.5px, transparent 1.5px), radial-gradient(circle at 0% 0%, #fef08a 1px, transparent 1px)`,
              backgroundSize: '20px 20px, 10px 10px',
            }}
          />
          {/* Inner Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* ============================================================ */}
        {/* THE GREETING CARD (Rounded corners & golden trims) */}
        {/* ============================================================ */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) w-[92%] sm:w-[94%] ${
            isOpen
              ? 'top-[-125px] sm:top-[-140px] scale-100 opacity-100 z-40 shadow-[0_35px_80px_rgba(0,0,0,0.9),_0_0_50px_rgba(212,175,55,0.35)] animate-[floatGentle_5s_ease-in-out_infinite]'
              : 'top-6 scale-95 opacity-0 pointer-events-none z-10'
          }`}
          onClick={(e) => {
            // Clicking the card folds the envelope back gracefully
            e.stopPropagation();
            handleToggle();
          }}
        >
          {/* Card Body - Rounded-2xl Obsidian Navy & Brushed Gold Foil */}
          <div className="relative rounded-[24px] bg-gradient-to-br from-[#0c162b] via-[#0f1f3d] to-[#070c18] border-2 border-[#d4af37] p-6 sm:p-8 backdrop-blur-2xl overflow-hidden group">
            {/* Dynamic Gold Foil Light Sweep */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent rotate-45 pointer-events-none animate-[goldShine_4s_infinite]" />

            {/* Inner Rounded Gold Borders */}
            <div className="absolute inset-2 border border-[#d4af37]/40 rounded-[18px] pointer-events-none" />
            <div className="absolute inset-3 border border-[#d4af37]/20 rounded-[14px] pointer-events-none" />

            {/* Sculpted Metallic Corner Guards */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#fef08a] rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#fef08a] rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#fef08a] rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#fef08a] rounded-br-sm" />

            {/* Card Content Container */}
            <div className="relative flex flex-col items-center justify-center py-5 px-3 text-center">
              {/* Royal Emblem */}
              <div className="mb-4 flex items-center justify-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <div className="mx-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <span className="text-amber-950 text-xs font-black">✦</span>
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
              </div>

              {/* Main Line: "عيد ميلاد سعيد مصطفى خيري" */}
              <h1 className="font-reem text-3xl sm:text-4xl md:text-5xl font-bold text-gold-emboss leading-relaxed tracking-wide text-balance py-2">
                عيد ميلاد سعيد مصطفى خيري
              </h1>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ENVELOPE FRONT POCKET (Wrapped in rounded-[32px] container) */}
        {/* ============================================================ */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-20">
          {/* Left Side Flap */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
              background: 'linear-gradient(135deg, #0e1933 0%, #080e1e 100%)',
              borderRight: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
            }}
          />

          {/* Right Side Flap */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
              background: 'linear-gradient(225deg, #0e1933 0%, #080e1e 100%)',
              borderLeft: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
            }}
          />

          {/* Bottom Flap */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
              background: 'linear-gradient(to top, #060b17 0%, #0f1c3a 100%)',
              borderTop: '1.5px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 -10px 25px rgba(0,0,0,0.6)',
            }}
          >
            {/* Bottom Gold Edge Bevel */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 opacity-90" />
          </div>

          {/* Executive Gold Satin Ribbon Band (Fades out when opened) */}
          <div
            className={`absolute top-[44%] -translate-y-1/2 inset-x-0 h-8 transition-all duration-700 pointer-events-none flex items-center ${
              isOpen ? 'opacity-0 scale-x-110' : 'opacity-100 scale-x-100'
            }`}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 8%, #ca8a04 25%, #fef08a 50%, #ca8a04 75%, rgba(212,175,55,0.1) 92%, transparent 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5), 0 0 10px rgba(212,175,55,0.3)',
              borderTop: '1px solid rgba(254, 240, 138, 0.6)',
              borderBottom: '1px solid rgba(254, 240, 138, 0.6)',
            }}
          />
        </div>

        {/* ============================================================ */}
        {/* TOP FLAP (Smooth Curved SVG Flap with 3D rotateX folding) */}
        {/* ============================================================ */}
        <div
          className="absolute inset-x-0 top-0 h-full origin-top transition-transform duration-700 ease-in-out pointer-events-auto"
          style={{
            transformStyle: 'preserve-3d',
            transform: isOpen || isOpeningPhase ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: isOpen ? 5 : 30,
          }}
        >
          {/* Outside of Top Flap with smooth curved rounded edges */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.75))',
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 460 315"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flapOutsideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#112044" />
                  <stop offset="100%" stopColor="#081022" />
                </linearGradient>
                <linearGradient id="flapGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#b38728" />
                </linearGradient>
              </defs>
              {/* Smooth curved flap with rounded top corners and rounded apex */}
              <path
                d="M 32,0 L 428,0 Q 460,0 458,30 L 256,170 Q 230,188 204,170 L 2,30 Q 0,0 32,0 Z"
                fill="url(#flapOutsideGradient)"
                stroke="url(#flapGoldBorder)"
                strokeWidth="2"
              />
              {/* Subtle top golden lip */}
              <path
                d="M 32,1 L 428,1"
                stroke="url(#flapGoldBorder)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Majestic Royal Wax Seal Medallion */}
          {(!isOpen || isOpeningPhase) && (
            <div
              className={`absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 transition-all duration-300 ${
                isOpeningPhase ? 'scale-130 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
              }`}
            >
              {/* Outer Golden Aura Glow */}
              <div className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

              <div
                className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8),_0_0_25px_rgba(212,175,55,0.5)] transition-transform duration-300"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #fffbe6 0%, #fde047 20%, #d4af37 55%, #78350f 100%)',
                  border: '2px solid #fef08a',
                }}
              >
                {/* Wax Seal Rim Engraving with Royal Monogram 'م' */}
                <div className="w-full h-full rounded-full border border-amber-900/50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-300/30 to-amber-900/40">
                  <span className="font-reem text-2xl sm:text-3xl font-black text-amber-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] leading-none">
                    م
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Inside of Top Flap (When flipped 180 degrees) */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              transform: 'rotateY(180deg) rotateZ(180deg)',
              filter: 'drop-shadow(0 -6px 14px rgba(0,0,0,0.6))',
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 460 315"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flapInsideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#060b17" />
                  <stop offset="100%" stopColor="#0d1c3a" />
                </linearGradient>
              </defs>
              <path
                d="M 32,0 L 428,0 Q 460,0 458,30 L 256,170 Q 230,188 204,170 L 2,30 Q 0,0 32,0 Z"
                fill="url(#flapInsideGradient)"
                stroke="url(#flapGoldBorder)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
