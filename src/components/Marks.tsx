export function Arrow({
  direction = "right",
}: {
  direction?: "right" | "left" | "down" | "up";
}) {
  return (
    <svg
      className={`arrow arrow--${direction}`}
      viewBox="0 0 32 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 10h28M21 2l8 8-8 8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function FlowerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`flower-mark ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx="32"
            cy="20"
            rx="4.2"
            ry="12"
            transform={`rotate(${i * 45} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="4" />
      </g>
    </svg>
  );
}

export function Bee({ className = "" }: { className?: string }) {
  return (
    <svg className={`bee ${className}`} viewBox="0 0 80 60" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <ellipse
          className="bee-wing bee-wing--one"
          cx="31"
          cy="19"
          rx="13"
          ry="7"
          transform="rotate(32 31 19)"
        />
        <ellipse
          className="bee-wing bee-wing--two"
          cx="44"
          cy="16"
          rx="13"
          ry="7"
          transform="rotate(-25 44 16)"
        />
        <ellipse
          cx="37"
          cy="33"
          rx="17"
          ry="10"
          transform="rotate(-10 37 33)"
          fill="currentColor"
          fillOpacity=".13"
        />
        <path d="M31 24l3 18m5-19 3 19m5-18 3 16M22 32l-8 6m10-3-3 13m14-6-1 8m19-23 5-3m-4 0 1-6M53 28l8-1" />
        <circle cx="56" cy="30" r="5" fill="currentColor" fillOpacity=".12" />
      </g>
    </svg>
  );
}

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`brand ${light ? "brand--light" : ""}`}
      href="#sakums"
      aria-label="Lejas Stupēni — sākums"
    >
      <img
        className="brand-logo"
        src="./images/stupenu-medus-logo.png"
        alt="Stupēnu medus"
        width="208"
        height="180"
      />
      <span>
        Lejas Stupēni<small>PIEBALGAS PUSĒ · LATVIJĀ</small>
      </span>
    </a>
  );
}
