import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
}

export const SparkleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animRef = useRef<number | null>(null);

  const colors = ['#fef08a', '#d4af37', '#eab308', '#fff7ed', '#38bdf8'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const addSparkle = (x: number, y: number, count: number = 2) => {
      for (let i = 0; i < count; i++) {
        sparklesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.8,
          vy: Math.random() * -1.8 - 0.5,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 6,
        });
      }
      if (!animRef.current) {
        loop();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      addSparkle(e.clientX, e.clientY, 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        addSparkle(e.touches[0].clientX, e.touches[0].clientY, 3);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Periodic gentle ambient sparkles across screen
    const ambientInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randX = Math.random() * window.innerWidth;
        const randY = Math.random() * (window.innerHeight * 0.8) + window.innerHeight * 0.1;
        addSparkle(randX, randY, 2);
      }
    }, 400);

    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * r + cx, -Math.sin(((18 + i * 90) * Math.PI) / 180) * r + cy);
        c.lineTo(Math.cos(((54 + i * 90) * Math.PI) / 180) * (r * 0.3) + cx, -Math.sin(((54 + i * 90) * Math.PI) / 180) * (r * 0.3) + cy);
      }
      c.closePath();
      c.fill();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const list = sparklesRef.current;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        drawStar(ctx, 0, 0, p.size);
        ctx.restore();
      }

      if (list.length > 0) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        animRef.current = null;
      }
    };

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearInterval(ambientInterval);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
