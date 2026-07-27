// components/starfield/Starfield.tsx
import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;

    const stars = Array.from({ length: 200 }, () => ({
      xFrac: Math.random(),
      yFrac: Math.random(),
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.0003 + 0.00005,
    }));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    function draw() {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      for (const star of stars) {
        const x = star.xFrac * canvas.width;
        const y = star.yFrac * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.yFrac += star.speed;
        if (star.yFrac > 1) star.yFrac = 0;
      }
      animationId = requestAnimationFrame(draw);
    }

    requestAnimationFrame(() => {
      resize();
      draw();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
}