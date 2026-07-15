import { useEffect, useRef } from 'react';

export default function FireworksBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    const maxParticles = 800; 
    
    // Resize handler
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 2 + 1;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005; 
      }

      update() {
        this.vy += 0.05; 
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Rocket {
      x: number;
      y: number;
      vy: number;
      targetY: number;

      constructor(x: number) {
        this.x = x;
        this.y = h;
        this.vy = -(Math.random() * 4 + 8); 
        this.targetY = Math.random() * (h / 2) + 50;
      }

      update() {
        this.y += this.vy;
        createSpark(this.x, this.y + 5, true); 
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFD700';
        ctx.fill();
        ctx.restore();
      }
    }

    const colors = ['#FFD700', '#FF6B00', '#FFFFFF', '#FF3366', '#33CCFF'];

    const createFirework = (x: number, y: number, big = false) => {
      const particleCount = big ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 30) + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < particleCount; i++) {
        if (particles.length < maxParticles) {
          const p = new Particle(x, y, color);
          if (big) {
            p.vx *= 1.5;
            p.vy *= 1.5;
            p.radius *= 1.5;
          }
          particles.push(p);
        }
      }
    };

    const createSpark = (x: number, y: number, isRocketTrail = false) => {
      if (!isRocketTrail && Math.random() > 0.3) return; 
      if (particles.length >= maxParticles) return;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const p = new Particle(x, y, color);
      p.radius = Math.random() * 1.5 + 0.5;
      p.decay = Math.random() * 0.03 + 0.01;
      p.vx *= 0.2; // tighter spread for trails
      if (isRocketTrail) {
        p.vy = Math.random() * 2 + 1; // force downwards
      }
      particles.push(p);
    };

    const handleClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      createSpark(e.clientX, e.clientY);
    };

    const handleLaunchRocket = () => {
      // Launch 5 rockets in sequence
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          rockets.push(new Rocket(Math.random() * w * 0.8 + w * 0.1));
        }, i * 400);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('launchRocket', handleLaunchRocket as EventListener);

    let lastTime = 0;
    const interval = 8000; 

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
      ctx.fillRect(0, 0, w, h);

      if (timestamp - lastTime > interval) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.5; 
        createFirework(x, y);
        lastTime = timestamp;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);
        if (r.y <= r.targetY) {
          createFirework(r.x, r.y, true); 
          createFirework(r.x, r.y, true);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('launchRocket', handleLaunchRocket as EventListener);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen opacity-80"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
