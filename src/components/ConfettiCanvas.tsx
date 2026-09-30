import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiCanvasRef {
  burst: (originX?: number, originY?: number, particleCount?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  shape: 'rect' | 'star' | 'circle';
  opacity: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;
}

export const ConfettiCanvas = forwardRef<ConfettiCanvasRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Masculine executive color palette: Metallic golds, deep navy, champagne, chrome slate
  const colors = [
    '#d4af37', // metallic gold
    '#f5d77f', // bright gold
    '#c59b27', // deep gold
    '#e2e8f0', // platinum silver
    '#94a3b8', // slate steel
    '#38bdf8', // subtle royal azure
    '#1e293b', // midnight slate
    '#fbbf24', // amber gold
  ];

  const createBurst = (originX?: number, originY?: number, particleCount: number = 90) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = originX ?? canvas.width / 2;
    const startY = originY ?? canvas.height * 0.45;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      const shapes: Array<'rect' | 'star' | 'circle'> = ['rect', 'rect', 'star', 'circle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      newParticles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // upward boost
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        width: Math.random() * 10 + 6,
        height: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
        opacity: 1,
        decay: Math.random() * 0.007 + 0.005,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
      });
    }

    particlesRef.current.push(...newParticles);

    if (!animFrameRef.current) {
      loop();
    }
  };

  useImperativeHandle(ref, () => ({
    burst: createBurst,
  }));

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Gravity and air resistance
      p.vy += 0.22;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      const scaleX = Math.cos(p.wobble);
      ctx.scale(scaleX, 1);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'star') {
        drawStar(ctx, 0, 0, 5, p.width * 0.8, p.width * 0.38);
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      animFrameRef.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';
