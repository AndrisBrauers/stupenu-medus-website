import { useRef, useState } from "react";
import { Botanical } from "./Botanical";
import { Arrow, Bee } from "./Marks";
import { useScrollScene } from "../hooks/useMotion";
import NectarStudy from "./NectarStudy";

const cells = [
  {
    title: "Zieds",
    label: "Pļavas rokraksts",
    text: "Bites nelasa etiķetes. Medus garšu nosaka tas, kas tajā vasarā ziedēja apkārt dravai.",
    kind: "flower",
    x: 50,
    y: 18,
  },
  {
    title: "Bite",
    label: "Mazais lielais darbs",
    text: "No zieda uz ziedu, atpakaļ uz stropu. Sīks ceļš, ko burciņā vairs nevar redzēt.",
    kind: "bee",
    x: 26,
    y: 36,
  },
  {
    title: "Strops",
    label: "Mājas, kurās dūc",
    text: "Koks, vasks un tūkstošiem mazu darbu. Šis ir īsts skats mūsu dravā — ar visu zāli un laika pēdām.",
    kind: "hive",
    x: 74,
    y: 36,
  },
  {
    title: "Vasks",
    label: "Sešas malas. Viena kārtība.",
    text: "Bites veido šūnas no vaska. Stropā tās glabā gan medu, gan ziedputekšņus. Sava maza, precīza pasaule.",
    kind: "wax",
    x: 50,
    y: 54,
  },
  {
    title: "Medus",
    label: "Vasara nesteidzas",
    text: "Nektārs pārtop medū. Mēs gaidām, līdz bites savu darbu ir paveikušas, un tikai tad sākas mūsējais.",
    kind: "honey",
    x: 26,
    y: 72,
  },
  {
    title: "Rokas",
    label: "Dravas ikdiena",
    text: "Aiz katras burciņas ir arī cilvēka darbs. Atvērt stropu, apskatīt saimi, uzmanīgi izcelt rāmi.",
    kind: "hands",
    x: 74,
    y: 72,
  },
];

export default function Apiary() {
  const intro = useRef<HTMLElement>(null),
    ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(2);
  useScrollScene(intro);
  useScrollScene(ref);
  return (
    <>
      <section className="field-note" ref={intro}>
        <div className="field-note-index">
          <span>NO ZIEDA</span>
          <span>UZ ZIEDU.</span>
          <Bee />
        </div>
        <div className="field-note-heading">
          Bites nelasa
          <br />
          <em>etiķetes.</em>
        </div>
        <div className="field-note-copy">
          <p>
            Tāpēc katras burciņas garšu nosaka tas, kas tajā vasarā ziedēja
            apkārt dravai.
          </p>
          <span>PĻAVA RAKSTA RECEPTI. MĒS TO SAGLABĀJAM.</span>
        </div>
        <svg
          className="note-flight"
          viewBox="0 0 1200 350"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M35-20c20 300 300 160 410 230s30 90 165 55 350-140 610 75"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </svg>
        <NectarStudy />
      </section>
      <section
        className="apiary"
        id="drava"
        ref={ref}
        aria-labelledby="apiary-title"
      >
        <div className="apiary-top">
          <span>02 / STROPA IEKŠPUSĒ</span>
          <span>LEJAS STUPĒNU DRAVA</span>
        </div>
        <div className="apiary-heading">
          <h2 id="apiary-title">
            Mazā pasaule.
            <br />
            <em>Lielais darbs.</em>
          </h2>
          <p>
            Viss sākas ar ziedu.
            <br />
            Pārējais ir bišu ziņā.
          </p>
          <span className="apiary-instruction">
            <span className="tiny-hex" /> IZPĒTI STROPU — IZVĒLIES ŠŪNU
          </span>
        </div>
        <div className="comb-composition">
          <div className="comb-orbit" aria-hidden="true" />
          {cells.map((cell, i) => (
            <button
              className={`comb-cell comb-cell--${cell.kind} ${active === i ? "is-active" : ""}`}
              style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
              key={cell.title}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => {
                if (e.pointerType !== "touch") setActive(i);
              }}
              onFocus={() => setActive(i)}
              aria-pressed={active === i}
              aria-label={`Izpētīt: ${cell.title}`}
            >
              <span className="comb-cell-inner">
                {cell.kind === "flower" ? (
                  <Botanical />
                ) : cell.kind === "bee" ? (
                  <Bee />
                ) : cell.kind === "hive" ? (
                  <img src="./images/hive-small.webp" alt="" loading="lazy" />
                ) : cell.kind === "hands" ? (
                  <img src="./images/beekeeper.webp" alt="" loading="lazy" />
                ) : (
                  <span
                    className={`comb-material comb-material--${cell.kind}`}
                  />
                )}
                <span className="comb-name">{cell.title}</span>
              </span>
            </button>
          ))}
          <span className="comb-annotation">APIS MELLIFERA</span>
          <span className="comb-number">
            {String(active + 1).padStart(2, "0")} / 06
          </span>
        </div>
        <div className="comb-description" key={active} aria-live="polite">
          <span>{cells[active].title.toUpperCase()}</span>
          <h3>{cells[active].label}</h3>
          <p>{cells[active].text}</p>
        </div>
        <div className="apiary-footer">
          <span>VIENA ŠŪNA IR TIKAI SĀKUMS.</span>
          <a href="#gads">
            Viss ir atkarīgs no laika <Arrow />
          </a>
        </div>
      </section>
    </>
  );
}
