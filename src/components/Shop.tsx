import { useRef, useState, type CSSProperties } from "react";
import { honeys, money, type Honey } from "../data";
import { Botanical } from "./Botanical";
import Jar from "./Jar";
import { Arrow } from "./Marks";
import { useScrollScene } from "../hooks/useMotion";

export default function Shop({
  onDetail,
  onAdd,
}: {
  onDetail: (honey: Honey) => void;
  onAdd: (honey: Honey, weight: number, qty: number) => void;
}) {
  const [selected, setSelected] = useState(0),
    [weight, setWeight] = useState(500);
  const ref = useRef<HTMLElement>(null),
    startX = useRef<number | null>(null),
    didSwipe = useRef(false);
  const honey = honeys[selected];
  useScrollScene(ref);
  const choose = (index: number) =>
    setSelected((index + honeys.length) % honeys.length);
  return (
    <section
      className={`shop shop--${honey.id}`}
      id="medus"
      ref={ref}
      aria-labelledby="shop-title"
      style={
        {
          "--product-paper": honey.pale,
          "--product-ink": honey.ink,
          "--product-gold": honey.color,
        } as CSSProperties
      }
    >
      <div className="shop-top">
        <span>04 / TAVA VASARAS GARŠA</span>
        <span>IZVĒLIES SAVU BURCIŅU</span>
      </div>
      <div className="shop-heading">
        <h2 id="shop-title">
          Kuru vasaru
          <br />
          <em>ņemsi līdzi?</em>
        </h2>
        <span className="shop-edition">
          LEJAS STUPĒNI
          <br />
          MEDUS KOLEKCIJA
        </span>
      </div>
      <div className="product-stage">
        <div className="product-copy" key={`${honey.id}-copy`}>
          <span className="product-index">
            0{selected + 1}
            <span>/ 04</span>
          </span>
          <h3>
            {honey.name}
            <br />
            <em>medus</em>
          </h3>
          <p>{honey.description}</p>
          <div className="product-notes">
            {honey.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
          <button
            className="text-button product-open"
            onClick={() => onDetail(honey)}
          >
            Burciņas stāsts <Arrow />
          </button>
        </div>
        <div
          className="product-object"
          onPointerDown={(event) => {
            startX.current = event.clientX;
            didSwipe.current = false;
          }}
          onPointerUp={(event) => {
            if (startX.current !== null) {
              const dx = event.clientX - startX.current;
              if (Math.abs(dx) > 45) {
                didSwipe.current = true;
                choose(selected + (dx < 0 ? 1 : -1));
              }
              startX.current = null;
            }
          }}
          onPointerCancel={() => {
            startX.current = null;
          }}
        >
          <div className="product-orbit" aria-hidden="true" />
          <span className="product-latin">{honey.latin}</span>
          <div className="product-plant" key={`${honey.id}-plant`}>
            <Botanical variety={honey.id} />
          </div>
          <button
            className="jar-detail-trigger"
            onClick={() => {
              if (didSwipe.current) {
                didSwipe.current = false;
                return;
              }
              onDetail(honey);
            }}
            aria-label={`Atvērt: ${honey.name} medus`}
          >
            <Jar
              honey={honey}
              weight={weight}
              interactive
              className={`shop-jar ${weight === 1000 ? "jar--large" : ""}`}
            />
          </button>
          <span className="product-drag-note">
            <span>←</span> VELC, LAI MAINĪTU GARŠU <span>→</span>
          </span>
        </div>
        <div className="product-purchase">
          <dl>
            <dt>IEVĀKUMA LAIKS</dt>
            <dd>{honey.harvest}</dd>
          </dl>
          <div
            className="weight-picker"
            role="group"
            aria-label="Burciņas izmērs"
          >
            {[500, 1000].map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                aria-pressed={weight === w}
                className={weight === w ? "is-active" : ""}
              >
                {w === 500 ? "500 g" : "1 kg"}
              </button>
            ))}
          </div>
          <span className="product-price">
            {money(honey.price * (weight === 500 ? 1 : 1.8))}
          </span>
          <button
            className="add-button"
            onClick={() => onAdd(honey, weight, 1)}
          >
            Pievienot grozam <span>+</span>
          </button>
          <span className="product-price-note">
            Paraugcenas · vizuālais makets
          </span>
        </div>
      </div>
      <div className="product-navigation">
        <button
          className="round-arrow"
          onClick={() => choose(selected - 1)}
          aria-label="Iepriekšējais medus"
        >
          <Arrow direction="left" />
        </button>
        <div className="product-tabs" role="group" aria-label="Medus šķirnes">
          {honeys.map((h, i) => (
            <button
              className={i === selected ? "is-active" : ""}
              key={h.id}
              onClick={() => choose(i)}
              aria-pressed={i === selected}
            >
              <span>0{i + 1}</span>
              {h.short}
            </button>
          ))}
        </div>
        <button
          className="round-arrow"
          onClick={() => choose(selected + 1)}
          aria-label="Nākamais medus"
        >
          <Arrow />
        </button>
      </div>
    </section>
  );
}
