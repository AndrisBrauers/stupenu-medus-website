import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { honeys, seasons } from "../data";
import { Botanical } from "./Botanical";
import { Bee } from "./Marks";
import { useScrollScene } from "../hooks/useMotion";

export default function Seasons() {
  const ref = useRef<HTMLElement>(null),
    dialRef = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState(2);
  const [dragging, setDragging] = useState(false);
  const season = seasons[month];
  const honey = honeys.find((h) => h.id === season.variety)!;
  useScrollScene(ref);
  const pick = (event: PointerEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    let angle =
      (Math.atan2(
        event.clientY - rect.top - rect.height / 2,
        event.clientX - rect.left - rect.width / 2,
      ) *
        180) /
        Math.PI +
      90;
    if (angle < 0) angle += 360;
    setMonth(Math.round(angle / 60) % 6);
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      [
        "ArrowRight",
        "ArrowUp",
        "ArrowLeft",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      event.preventDefault();
      setMonth((n) =>
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? 5
            : (n + (["ArrowRight", "ArrowUp"].includes(event.key) ? 1 : 5)) % 6,
      );
    }
  };
  return (
    <section
      className="seasons"
      id="gads"
      ref={ref}
      aria-labelledby="season-title"
    >
      <div className="seasons-top">
        <span>03 / BIŠU LAIKS</span>
        <span>PAVASARIS → VASARA → MIERS</span>
      </div>
      <h2 id="season-title">
        Nekad nav divu
        <br />
        <em>vienādu vasaru.</em>
      </h2>
      <div className="season-stage">
        <div className="season-dial-area">
          <div
            className={`season-dial ${dragging ? "is-dragging" : ""}`}
            ref={dialRef}
            role="slider"
            aria-label="Izvēlēties mēnesi"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={month}
            aria-valuetext={season.name}
            tabIndex={0}
            onKeyDown={keyboard}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              pick(e);
            }}
            onPointerMove={(e) => {
              if (dragging) pick(e);
            }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            <svg
              viewBox="0 0 480 480"
              className="season-rings"
              aria-hidden="true"
            >
              <circle cx="240" cy="240" r="196" />
              <circle cx="240" cy="240" r="176" strokeDasharray="1 13" />
              {Array.from({ length: 60 }, (_, i) => (
                <path
                  key={i}
                  d={i % 10 === 0 ? "M240 33v15" : "M240 37v5"}
                  transform={`rotate(${i * 6} 240 240)`}
                />
              ))}
              <circle
                cx="240"
                cy="240"
                r="220"
                strokeDasharray="2 7"
                opacity=".4"
              />
            </svg>
            <div
              className="season-needle"
              style={{ transform: `rotate(${month * 60}deg)` }}
            >
              <span />
            </div>
            <div className="season-botanical" key={season.variety}>
              <Botanical variety={season.variety} />
            </div>
            <div className="season-center">
              <span>{season.month}</span>
              <small>{String(month + 4).padStart(2, "0")}</small>
            </div>
          </div>
          <div className="season-months" role="group" aria-label="Mēneši">
            {seasons.map((s, i) => (
              <button
                key={s.month}
                className={i === month ? "is-active" : ""}
                onClick={() => setMonth(i)}
                aria-pressed={i === month}
              >
                {s.month}
              </button>
            ))}
          </div>
          <span className="season-hint">
            PAGRIEZ VASARU · VELC VAI IZVĒLIES MĒNESI
          </span>
        </div>
        <div className="season-note" key={month} aria-live="polite">
          <span className="season-note-month">
            {season.name} / dravas pieraksti
          </span>
          <h3>{season.title}</h3>
          <p>{season.text}</p>
          <span className="season-flower-line">{season.flowers}</span>
          <div className="season-swatch" style={{ background: honey.color }}>
            <span>IESPĒJAMĀ VASARAS NOKRĀSA</span>
          </div>
        </div>
        <Bee className="season-bee" />
      </div>
      <p className="season-footnote">
        Medus ir vietas un laika garša.
        <br />
        <em>Nevis vienmēr viena un tā pati recepte.</em>
      </p>
    </section>
  );
}
