"use client";

import React, { useEffect, useRef } from "react";

export const BackgroundMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      opacitySpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.opacitySpeed = (Math.random() - 0.5) * 0.005;
        
        const rand = Math.random();
        if (rand < 0.33) {
          this.color = "124, 58, 237"; // Purple (#7C3AED)
        } else if (rand < 0.66) {
          this.color = "6, 182, 212";   // Cyan (#06B6D4)
        } else {
          this.color = "139, 92, 246";  // Violet (#8B5CF6)
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.opacity += this.opacitySpeed;
        if (this.opacity <= 0.1 || this.opacity >= 0.7) {
          this.opacitySpeed = -this.opacitySpeed;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        context.shadowColor = `rgba(${this.color}, 0.8)`;
        context.shadowBlur = this.size * 3;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    class GradientBlob {
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
      vx: number;
      vy: number;

      constructor(color1: string, color2: string, radius: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = radius;
        this.color1 = color1;
        this.color2 = color2;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius < 0 || this.x + this.radius > width) {
          this.vx = -this.vx;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
          this.vy = -this.vy;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const grad = context.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        grad.addColorStop(0, this.color1);
        grad.addColorStop(1, this.color2);

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = grad;
        context.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => new Particle());
    
    const blobs = [
      new GradientBlob("rgba(124, 58, 237, 0.10)", "rgba(124, 58, 237, 0)", width * 0.5),
      new GradientBlob("rgba(6, 182, 212, 0.08)", "rgba(6, 182, 212, 0)", width * 0.4),
      new GradientBlob("rgba(139, 92, 246, 0.06)", "rgba(139, 92, 246, 0)", width * 0.45),
    ];

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeHandler);

    const draw = () => {
      ctx.fillStyle = "#030712"; // Match requested bg
      ctx.fillRect(0, 0, width, height);

      // Subtle grids
      ctx.strokeStyle = "rgba(255, 255, 255, 0.01)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "screen";
      blobs.forEach((blob) => {
        blob.update();
        blob.draw(ctx);
      });
      ctx.globalCompositeOperation = "source-over";

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(${particle.color}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen -z-10 pointer-events-none"
    />
  );
};
