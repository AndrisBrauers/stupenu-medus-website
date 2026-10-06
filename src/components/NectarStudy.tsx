import { useEffect, useRef } from "react";

// The same six radial petals slowly straighten into the six walls of a wax cell.
// Drawing only on scroll keeps this transition quiet, and essentially idle at rest.
export default function NectarStudy() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const section = canvas.closest("section")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false,
      frame = 0;
    const draw = () => {
      frame = 0;
      if (!visible) return;
      const dpr = Math.min(devicePixelRatio, 1.5),
        w = canvas.clientWidth,
        h = canvas.clientHeight;
      if (
        canvas.width !== Math.round(w * dpr) ||
        canvas.height !== Math.round(h * dpr)
      ) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const top = section.getBoundingClientRect().top;
      const progress = reduced
        ? 0.75
        : Math.max(
            0,
            Math.min(1, (innerHeight * 0.5 - top) / section.clientHeight),
          );
      const smooth = progress * progress * (3 - 2 * progress);
      const size = w < 500 ? 19 : 28;
      const centers = Array.from({ length: 15 }, (_, i) => ({
        x:
          w * 0.57 +
          (i % 5) * size * 1.8 +
          (Math.floor(i / 5) % 2) * size * 0.9,
        y: h * 0.35 + Math.floor(i / 5) * size * 1.56,
      }));
      centers.forEach((center, i) => {
        const irregularX = Math.sin(i * 6.3) * size * 0.7 * (1 - smooth),
          irregularY = Math.cos(i * 4.7) * size * 0.5 * (1 - smooth);
        ctx.beginPath();
        for (let k = 0; k <= 72; k++) {
          const angle = (k / 72) * Math.PI * 2 - Math.PI / 2;
          const petalRadius = size * (0.62 + 0.38 * Math.cos(angle * 6));
          const sideAngle =
            ((angle + Math.PI * 2 + Math.PI / 6) % (Math.PI / 3)) - Math.PI / 6;
          const hexRadius =
            (size * Math.cos(Math.PI / 6)) / Math.cos(sideAngle);
          const radius = petalRadius * (1 - smooth) + hexRadius * smooth;
          const x = center.x + irregularX + Math.cos(angle) * radius,
            y = center.y + irregularY + Math.sin(angle) * radius;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(120,123,87,${0.12 + (i % 4) * 0.025})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
        if (smooth < 0.7) {
          ctx.beginPath();
          ctx.arc(
            center.x + irregularX,
            center.y + irregularY,
            1.4,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = `rgba(161,131,53,${0.4 * (1 - smooth)})`;
          ctx.fill();
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(canvas);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <canvas className="nectar-study" ref={ref} aria-hidden="true" />;
}
