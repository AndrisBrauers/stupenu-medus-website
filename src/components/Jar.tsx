import { useId, useRef, type CSSProperties, type PointerEvent } from "react";
import { type Honey } from "../data";

export default function Jar({
  honey,
  interactive = false,
  className = "",
  weight = 500,
}: {
  honey: Honey;
  interactive?: boolean;
  className?: string;
  weight?: number;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const mouse = (e: PointerEvent<HTMLDivElement>) => {
    if (
      !interactive ||
      e.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty("--jar-x", `${x * 12}deg`);
    e.currentTarget.style.setProperty("--jar-y", `${-y * 9}deg`);
    e.currentTarget.style.setProperty("--light-x", `${x * 12}px`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--jar-x", "0deg");
    ref.current?.style.setProperty("--jar-y", "0deg");
    ref.current?.style.setProperty("--light-x", "0px");
  };
  const g = (key: string) => `url(#${id}-${key})`;
  return (
    <div
      ref={ref}
      className={`jar ${className}`}
      style={
        { "--honey": honey.color, "--honey-dark": honey.dark } as CSSProperties
      }
      onPointerMove={mouse}
      onPointerLeave={reset}
    >
      <div className="jar-shadow" />
      <svg
        className="jar-object"
        viewBox="0 0 380 460"
        role="img"
        aria-label={`${honey.name} medus — ${weight === 500 ? "500 gramu" : "viena kilograma"} burciņas vizualizācija`}
      >
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2=".1">
            <stop stopColor="#b5b7a0" stopOpacity=".65" />
            <stop offset=".07" stopColor="#f6f4d7" stopOpacity=".9" />
            <stop offset=".17" stopColor="#fff" stopOpacity=".1" />
            <stop offset=".6" stopColor="#fff" stopOpacity=".06" />
            <stop offset=".87" stopColor="#737c67" stopOpacity=".25" />
            <stop offset=".96" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#545443" stopOpacity=".5" />
          </linearGradient>
          <linearGradient id={`${id}-honey`}>
            <stop stopColor={honey.dark} />
            <stop offset=".09" stopColor={honey.color} />
            <stop offset=".28" stopColor={honey.color} />
            <stop offset=".57" stopColor={honey.color} />
            <stop offset=".85" stopColor={honey.dark} />
            <stop offset="1" stopColor={honey.color} />
          </linearGradient>
          <linearGradient id={`${id}-lid`}>
            <stop stopColor="#736f57" />
            <stop offset=".08" stopColor="#c4b993" />
            <stop offset=".2" stopColor="#e8ddbd" />
            <stop offset=".4" stopColor="#b6a67c" />
            <stop offset=".7" stopColor="#ddd0a9" />
            <stop offset=".91" stopColor="#8b805e" />
            <stop offset="1" stopColor="#d2c49a" />
          </linearGradient>
          <linearGradient id={`${id}-label`}>
            <stop stopColor="#bcb8a6" />
            <stop offset=".09" stopColor="#e5e0cc" />
            <stop offset=".24" stopColor="#f5f0df" />
            <stop offset=".65" stopColor="#eee8d4" />
            <stop offset=".92" stopColor="#d3ccb5" />
            <stop offset="1" stopColor="#b6ae95" />
          </linearGradient>
          <linearGradient id={`${id}-shine`}>
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".4" stopColor="#fff8d1" stopOpacity=".5" />
            <stop offset=".65" stopColor="#fff" stopOpacity=".16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={honey.dark} stopOpacity=".35" />
            <stop offset=".5" stopColor={honey.color} stopOpacity="0" />
            <stop offset="1" stopColor={honey.dark} stopOpacity=".7" />
          </linearGradient>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              baseFrequency=".65"
              numOctaves="3"
              seed="4"
              type="fractalNoise"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope=".09" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <clipPath id={`${id}-body`}>
            <path d="M82 128C81 111 93 101 113 93V73h154v20c20 8 32 18 31 35l-4 267c0 19-16 31-35 32H122c-20-1-34-12-35-32Z" />
          </clipPath>
        </defs>
        <path
          d="M82 128C81 111 93 101 113 93V73h154v20c20 8 32 18 31 35l-4 267c0 19-16 31-35 32H122c-20-1-34-12-35-32Z"
          fill={g("glass")}
          stroke="#6c6b51"
          strokeOpacity=".3"
          strokeWidth="1"
        />
        <g clipPath={g("body")}>
          <path
            d="M87 135Q189 121 293 135L290 394q0 23-33 24H122q-28 0-31-24Z"
            fill={g("honey")}
            className="jar-honey-fill"
          />
          <path
            d="M87 135Q189 121 293 135L290 394q0 23-33 24H122q-28 0-31-24Z"
            fill={g("depth")}
          />
          <ellipse
            cx="190"
            cy="134"
            rx="103"
            ry="9"
            fill={honey.color}
            stroke={honey.dark}
            strokeOpacity=".35"
          />
          <path
            d="M85 149h210v256H85Z"
            fill={g("honey")}
            opacity=".25"
            filter={g("grain")}
          />
          {[
            [112, 163, 2],
            [141, 147, 1],
            [246, 162, 1.3],
            [272, 181, 2.2],
            [253, 377, 1.5],
            [104, 363, 1.1],
            [159, 390, 1],
            [218, 152, 1.2],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff5c1" opacity=".28" />
          ))}
          <path
            d="M95 401Q190 412 286 401M96 408Q190 419 283 408"
            fill="none"
            stroke="#efe6bc"
            strokeOpacity=".3"
            strokeWidth="2"
          />
          <path
            d="M91 203Q190 196 293 203L292 353Q190 363 91 353Z"
            fill={g("label")}
            filter={g("grain")}
          />
          <path
            d="M97 210Q190 203 286 210M96 346Q190 354 286 346"
            fill="none"
            stroke="#78755a"
            strokeWidth=".6"
            opacity=".65"
          />
          <g fill={honey.ink} textAnchor="middle">
            <image
              href="./images/stupenu-medus-logo.png"
              x="140"
              y="212"
              width="100"
              height="86.54"
            />
            <text
              x="190"
              y="320"
              fontSize="22"
              fontFamily="Cormorant Garamond, serif"
              fontStyle="italic"
            >
              {honey.name}
            </text>
            <text
              x="190"
              y="342"
              fontSize="8"
              fontFamily="Manrope, sans-serif"
              letterSpacing="1.5"
            >
              PIEBALGAS PUSĒ · {weight === 500 ? "500 g" : "1 kg"}
            </text>
          </g>
          <path
            className="jar-glint"
            d="M106 113c-6 48-5 102-4 163s2 103 6 122l12 3c-6-58-6-231 3-291Z"
            fill={g("shine")}
          />
          <path
            d="M276 112c9 58 8 232 3 285l5-3c7-83 7-180 0-277Z"
            fill="#fffde5"
            opacity=".22"
          />
          <path
            d="M119 100Q190 90 259 100"
            stroke="#fffbdf"
            strokeOpacity=".48"
            strokeWidth="3"
            fill="none"
          />
        </g>
        <path
          d="M110 75Q190 80 270 75v15Q190 99 110 90Z"
          fill={g("lid")}
          stroke="#736c53"
          strokeOpacity=".7"
        />
        <rect
          x="105"
          y="53"
          width="170"
          height="31"
          rx="7"
          fill={g("lid")}
          stroke="#857855"
          strokeWidth=".7"
        />
        <ellipse
          cx="190"
          cy="54"
          rx="84"
          ry="9"
          fill="#d8cca9"
          stroke="#92866a"
          strokeWidth=".8"
        />
        <ellipse
          cx="190"
          cy="53"
          rx="74"
          ry="5.5"
          fill="none"
          stroke="#eee5c9"
          strokeWidth=".8"
        />
        {Array.from({ length: 42 }, (_, i) => (
          <path
            key={i}
            d={`M${109 + i * 3.92} 60v17`}
            stroke={i % 3 ? "#786b47" : "#fff3c9"}
            strokeWidth="1"
            strokeOpacity={i % 3 ? ".3" : ".65"}
          />
        ))}
        <path
          d="M107 80Q190 83 273 80"
          stroke="#f0e7c9"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
