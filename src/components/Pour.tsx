import { useEffect, useRef } from "react";
import { useScrollScene } from "../hooks/useMotion";

export default function Pour() {
  const ref = useRef<HTMLElement>(null);
  const thread = useRef<SVGPathElement>(null);
  useScrollScene(ref);
  useEffect(() => {
    const element = ref.current,
      path = thread.current;
    if (
      !element ||
      !path ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let target = 0,
      current = 0,
      frame = 0;
    const draw = () => {
      current += (target - current) * 0.085;
      const bend = current,
        neck = 4 - Math.min(Math.abs(bend) / 40, 2.5);
      path.setAttribute(
        "d",
        `M592 -10 C${588 + bend * 0.15} 70 ${599 + bend} 134 ${596 + bend} 211 S${591 + bend * 0.35} 282 601 316 L591 316 C${600 + bend * 0.35} 279 ${590 + bend - neck} 259 ${592 + bend - neck} 211 S${594 + bend * 0.15} 62 588 -10 Z`,
      );
      if (Math.abs(target - current) > 0.05)
        frame = requestAnimationFrame(draw);
      else frame = 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      target = Math.max(
        -90,
        Math.min(
          90,
          ((event.clientX - rect.left - rect.width / 2) / rect.width) * 230,
        ),
      );
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      target = 0;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <section className="pour" ref={ref} aria-label="No stropa līdz burciņai">
      <span className="pour-left">NEKO LIEKU.</span>
      <span className="pour-right">TIKAI MEDU.</span>
      <svg
        className="honey-stream"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pour-gold" x1="0" x2="1">
            <stop stopColor="#70440f" />
            <stop offset=".18" stopColor="#bc841f" />
            <stop offset=".46" stopColor="#eac768" />
            <stop offset=".7" stopColor="#b98020" />
            <stop offset="1" stopColor="#74460e" />
          </linearGradient>
          <linearGradient id="pour-pool" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#a16e23" stopOpacity=".8" />
            <stop offset="1" stopColor="#d0a14f" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <path
          ref={thread}
          className="pour-thread"
          d="M592-10C583 65 613 145 596 223s-5 70 5 94h-10c11-37-8-64 2-102S598 67 588-10Z"
          fill="url(#pour-gold)"
        />
        <ellipse
          className="pour-ripple pour-ripple--one"
          cx="596"
          cy="322"
          rx="90"
          ry="11"
          fill="none"
          stroke="#b8893f"
          strokeWidth=".8"
        />
        <ellipse
          className="pour-ripple pour-ripple--two"
          cx="596"
          cy="322"
          rx="150"
          ry="20"
          fill="none"
          stroke="#b8893f"
          strokeWidth=".5"
        />
        <path
          d="M413 323c44-41 311-42 354 0-46 43-308 43-354 0Z"
          fill="url(#pour-pool)"
        />
        <ellipse
          cx="596"
          cy="321"
          rx="39"
          ry="5"
          fill="url(#pour-gold)"
          opacity=".6"
        />
      </svg>
      <span className="pour-caption">NO STROPA. AR PACIETĪBU.</span>
    </section>
  );
}
