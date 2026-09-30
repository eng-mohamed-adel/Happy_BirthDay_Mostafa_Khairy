import React, { useState } from 'react';
import { birthdayAudio } from '../audio/birthdayAudio';

interface BalloonItem {
  id: number;
  x: string;
  isRightSide: boolean;
  baseY: string;
  delay: number;
  size: number;
  colorType: 'gold' | 'navy' | 'slate' | 'champagne';
  swaySpeed: number;
  bobDistance: number;
}

export const BackgroundDecorations: React.FC = () => {
  const [wobblingId, setWobblingId] = useState<number | null>(null);

  // Richer balloon arrangement framing the scene with natural depth
  const balloons: BalloonItem[] = [
    // Left side cluster (foreground and background)
    { id: 1, x: '3%', isRightSide: false, baseY: '12%', delay: 0, size: 84, colorType: 'gold', swaySpeed: 5.2, bobDistance: 20 },
    { id: 2, x: '11%', isRightSide: false, baseY: '28%', delay: 1.1, size: 70, colorType: 'navy', swaySpeed: 6.0, bobDistance: 16 },
    { id: 3, x: '5%', isRightSide: false, baseY: '48%', delay: 2.3, size: 92, colorType: 'slate', swaySpeed: 4.8, bobDistance: 24 },
    { id: 4, x: '14%', isRightSide: false, baseY: '68%', delay: 0.7, size: 66, colorType: 'champagne', swaySpeed: 5.6, bobDistance: 18 },
    { id: 5, x: '2%', isRightSide: false, baseY: '82%', delay: 1.8, size: 78, colorType: 'gold', swaySpeed: 6.4, bobDistance: 22 },

    // Right side cluster (foreground and background)
    { id: 6, x: '4%', isRightSide: true, baseY: '15%', delay: 1.4, size: 88, colorType: 'navy', swaySpeed: 5.4, bobDistance: 22 },
    { id: 7, x: '13%', isRightSide: true, baseY: '32%', delay: 0.3, size: 74, colorType: 'gold', swaySpeed: 6.2, bobDistance: 17 },
    { id: 8, x: '6%', isRightSide: true, baseY: '52%', delay: 2.7, size: 68, colorType: 'champagne', swaySpeed: 4.9, bobDistance: 20 },
    { id: 9, x: '15%', isRightSide: true, baseY: '70%', delay: 1.6, size: 82, colorType: 'slate', swaySpeed: 5.8, bobDistance: 24 },
    { id: 10, x: '3%', isRightSide: true, baseY: '84%', delay: 2.0, size: 76, colorType: 'navy', swaySpeed: 6.1, bobDistance: 19 },
  ];

  const handleBalloonClick = (id: number) => {
    birthdayAudio.playBalloonPop();
    setWobblingId(id);
    setTimeout(() => {
      setWobblingId(null);
    }, 700);
  };

  const getBalloonStyles = (type: BalloonItem['colorType']) => {
    switch (type) {
      case 'gold':
        return {
          bodyGrad: 'radial-gradient(circle at 35% 28%, #fffbe6 0%, #fde047 25%, #d4af37 60%, #854d0e 100%)',
          highlight: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(254, 240, 138, 0.45)',
          shadow: '0 16px 36px -6px rgba(212, 175, 55, 0.45), 0 0 20px rgba(234, 179, 8, 0.2)',
          stringColor: '#d4af37',
        };
      case 'navy':
        return {
          bodyGrad: 'radial-gradient(circle at 35% 28%, #7dd3fc 0%, #0284c7 20%, #1e3a8a 55%, #080d1a 100%)',
          highlight: 'rgba(224, 242, 254, 0.65)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          shadow: '0 16px 36px -6px rgba(15, 23, 42, 0.8), 0 0 20px rgba(14, 165, 233, 0.25)',
          stringColor: '#38bdf8',
        };
      case 'slate':
        return {
          bodyGrad: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #cbd5e1 25%, #64748b 60%, #0f172a 100%)',
          highlight: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(203, 213, 225, 0.35)',
          shadow: '0 16px 36px -6px rgba(15, 23, 42, 0.6), 0 0 15px rgba(148, 163, 184, 0.2)',
          stringColor: '#94a3b8',
        };
      case 'champagne':
        return {
          bodyGrad: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #fef3c7 30%, #eab308 65%, #78350f 100%)',
          highlight: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(254, 243, 199, 0.5)',
          shadow: '0 16px 36px -6px rgba(234, 179, 8, 0.35), 0 0 18px rgba(253, 224, 71, 0.25)',
          stringColor: '#ca8a04',
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {/* Animated Deep Radial Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-amber-500/8 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-600/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating Golden Ribbons / Streamers in the background */}
      <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
        {/* Ribbon 1 - Left */}
        <svg
          className="absolute top-0 left-[8%] w-16 h-[100vh] animate-[floatGentle_8s_ease-in-out_infinite]"
          viewBox="0 0 60 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ribbonGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M30,0 C50,120 10,240 40,360 C15,480 50,600 25,720 C45,780 30,800 30,800"
            stroke="url(#ribbonGoldGrad1)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="18 4"
          />
        </svg>

        {/* Ribbon 2 - Right */}
        <svg
          className="absolute top-0 right-[8%] w-16 h-[100vh] animate-[floatGentle_9s_ease-in-out_infinite_1.5s]"
          viewBox="0 0 60 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ribbonGoldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M30,0 C10,140 50,260 20,390 C45,510 15,640 35,740 C20,780 30,800 30,800"
            stroke="url(#ribbonGoldGrad2)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="16 5"
          />
        </svg>
      </div>

      {/* Floating Stardust particles drifting */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(32)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${(i % 3) * 1.5 + 2}px`,
              height: `${(i % 3) * 1.5 + 2}px`,
              top: `${(i * 17) % 96}%`,
              left: `${(i * 29) % 96}%`,
              background: i % 2 === 0 ? '#fef08a' : '#38bdf8',
              opacity: (i % 6) * 0.12 + 0.35,
              boxShadow: i % 2 === 0 ? '0 0 10px 2px rgba(251, 191, 36, 0.7)' : '0 0 10px 2px rgba(56, 189, 248, 0.6)',
              animation: `floatGentle ${3.5 + (i % 4)}s ease-in-out infinite ${(i % 4) * 0.9}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative Hanging Bunting at Top */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none opacity-90 flex justify-center">
        <svg
          className="w-full max-w-5xl h-16"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,10 Q250,32 500,12 Q750,32 1000,10"
            stroke="url(#wireGoldGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <defs>
            <linearGradient id="wireGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="flagGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff7cc" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="flagNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#080d1a" />
            </linearGradient>
          </defs>

          {[
            { d: 'M110,14 L130,14 L120,46 Z', type: 'gold' },
            { d: 'M170,18 L190,18 L180,50 Z', type: 'navy' },
            { d: 'M230,22 L250,22 L240,54 Z', type: 'gold' },
            { d: 'M290,24 L310,24 L300,56 Z', type: 'navy' },
            { d: 'M350,22 L370,22 L360,54 Z', type: 'gold' },
            { d: 'M410,18 L430,18 L420,50 Z', type: 'navy' },
            { d: 'M470,13 L490,13 L480,45 Z', type: 'gold' },
            { d: 'M530,13 L550,13 L540,45 Z', type: 'navy' },
            { d: 'M590,18 L610,18 L600,50 Z', type: 'gold' },
            { d: 'M650,22 L670,22 L660,54 Z', type: 'navy' },
            { d: 'M710,24 L730,24 L720,56 Z', type: 'gold' },
            { d: 'M770,22 L790,22 L780,54 Z', type: 'navy' },
            { d: 'M830,18 L850,18 L840,50 Z', type: 'gold' },
            { d: 'M890,14 L910,14 L900,46 Z', type: 'navy' },
          ].map((flag, idx) => (
            <path
              key={idx}
              d={flag.d}
              fill={flag.type === 'gold' ? 'url(#flagGoldGrad)' : 'url(#flagNavyGrad)'}
              stroke="#fef08a"
              strokeWidth="0.8"
              opacity="0.9"
            />
          ))}
        </svg>
      </div>

      {/* Lively Floating Balloons */}
      {balloons.map((b) => {
        const styles = getBalloonStyles(b.colorType);
        const isWobbling = wobblingId === b.id;

        return (
          <div
            key={b.id}
            onClick={() => handleBalloonClick(b.id)}
            className="absolute pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group"
            style={{
              [b.isRightSide ? 'right' : 'left']: b.x,
              top: b.baseY,
              width: `${b.size}px`,
              animation: isWobbling
                ? 'wobble 0.6s ease-in-out'
                : `floatGentle ${b.swaySpeed}s ease-in-out infinite ${b.delay}s`,
            }}
          >
            {/* Balloon Body with 3D Specular Lighting */}
            <div
              className="relative rounded-[50%_50%_50%_50%_/_42%_42%_58%_58%] transition-shadow duration-300 group-hover:brightness-115"
              style={{
                width: `${b.size}px`,
                height: `${b.size * 1.22}px`,
                background: styles.bodyGrad,
                border: styles.border,
                boxShadow: styles.shadow,
              }}
            >
              {/* Main curved specular highlight */}
              <div
                className="absolute top-2 left-3 rounded-full blur-[0.8px] rotate-[-28deg]"
                style={{
                  width: `${b.size * 0.28}px`,
                  height: `${b.size * 0.52}px`,
                  background: `linear-gradient(to bottom, ${styles.highlight}, transparent)`,
                }}
              />

              {/* Secondary bottom soft reflection */}
              <div
                className="absolute bottom-3 right-3 rounded-full blur-[2px]"
                style={{
                  width: `${b.size * 0.22}px`,
                  height: `${b.size * 0.22}px`,
                  background: 'rgba(255, 255, 255, 0.35)',
                }}
              />

              {/* Balloon tie/knot */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 rounded-[2px]"
                style={{
                  background: styles.stringColor,
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>

            {/* Dynamic Sinuous String */}
            <svg
              className="w-10 h-32 -mt-0.5 mx-auto overflow-visible opacity-75 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 30 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15,0 Q20,28 10,55 T15,110"
                stroke={styles.stringColor}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
