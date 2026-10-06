import { useEffect, useRef } from "react";
import { Arrow, Bee } from "./Marks";
import { useScrollScene } from "../hooks/useMotion";

function Pollen() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0,
      active = true,
      previous = 0;
    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 73) % 101) / 101,
      y: ((i * 47) % 97) / 97,
      r: 0.6 + (i % 3) * 0.4,
      phase: i * 1.7,
    }));
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time: number) => {
      if (!active) return;
      frame = requestAnimationFrame(draw);
      if (time - previous < 32) return;
      previous = time;
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        const x =
          ((p.x + time * 0.000009) % 1) * w +
          Math.sin(time * 0.0003 + p.phase) * 20;
        const y = ((p.y - time * 0.000004 + 1) % 1) * h;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,247,199,${0.16 + Math.sin(time * 0.0008 + p.phase) * 0.1})`;
        ctx.fill();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (active) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    resize();
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas className="pollen" ref={ref} aria-hidden="true" />;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  return (
    <section
      className="hero"
      id="sakums"
      ref={ref}
      aria-labelledby="hero-title"
    >
      <div className="hero-landscape">
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet="./images/meadow-mobile.webp"
          />
          <img
            src="./images/meadow.webp"
            fetchPriority="high"
            alt="Vasaras pļava ar smalkām baltām savvaļas puķēm un zāļu stiebriem"
          />
        </picture>
      </div>
      <div className="hero-shade" />
      <Pollen />
      <div className="hero-topline">
        <span>01 / NO PĻAVAS</span>
        <span>VIENAS VASARAS PIERAKSTI</span>
      </div>
      <p className="hero-note">
        Ne viss, ko atnes vasara,
        <br />
        paliek atmiņā.
        <br />
        <em>Kaut kas paliek medū.</em>
      </p>
      <div className="hero-seal" aria-hidden="true">
        <svg viewBox="0 0 140 140">
          <defs>
            <path
              id="seal-circle"
              d="M70 70m-53 0a53 53 0 1 1 106 0a53 53 0 1 1-106 0"
            />
          </defs>
          <text>
            <textPath href="#seal-circle" textLength="330">
              LEJAS STUPĒNI · NO ZIEDA LĪDZ BURCIŅAI ·{" "}
            </textPath>
          </text>
          <image
            href="./images/stupenu-medus-logo.png"
            x="36"
            y="41"
            width="68"
            height="58.85"
          />
        </svg>
      </div>
      <h1 className="hero-title" id="hero-title">
        <span>Vasara,</span>
        <em>burciņā.</em>
      </h1>
      <div className="hero-bottom">
        <span>MEDUS NO PIEBALGAS PUSES.</span>
        <a className="hero-follow" href="#drava">
          Sekot bitei <Arrow direction="down" />
        </a>
        <span className="hero-bottom-right">PUĶES. BITES. UN PACIETĪBA.</span>
      </div>
      <svg
        className="hero-flight"
        viewBox="0 0 1000 500"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M760-30c-30 100 150 120 140 230S660 260 670 370s-90 80-90 170"
          stroke="currentColor"
          strokeWidth=".7"
          strokeDasharray="2 7"
        />
      </svg>
      <Bee className="hero-bee" />
      <div className="hero-caption">
        <span>Šeit sākas mūsu medus.</span>
        <span>↓</span>
      </div>
    </section>
  );
}
