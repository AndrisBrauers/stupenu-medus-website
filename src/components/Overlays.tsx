import { useRef, useState, useCallback } from "react";
import { type Honey, money, honeys } from "../data";
import { useDialog } from "../hooks/useMotion";
import { Arrow, Bee, FlowerMark } from "./Marks";
import { Botanical } from "./Botanical";
import Jar from "./Jar";

export type CartItem = { id: string; weight: number; qty: number };

function Close({ onClick }: { onClick: () => void }) {
  return (
    <button className="close-button" onClick={onClick} aria-label="Aizvērt">
      <span />
      <span />
    </button>
  );
}

export function ProductDetail({
  honey,
  onClose,
  onAdd,
}: {
  honey: Honey;
  onClose: () => void;
  onAdd: (honey: Honey, weight: number, qty: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null),
    [weight, setWeight] = useState(500),
    [qty, setQty] = useState(1);
  const close = useCallback(onClose, [onClose]);
  useDialog(true, ref, close);
  return (
    <div
      className="overlay overlay--detail"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={`detail detail--${honey.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        style={{ background: honey.pale, color: honey.ink }}
      >
        <Close onClick={onClose} />
        <div className="detail-art">
          <span className="detail-art-label">
            LEJAS STUPĒNU VASARAS KOLEKCIJA
          </span>
          <Botanical variety={honey.id} />
          <Jar honey={honey} weight={weight} interactive />
          <span className="detail-latin">{honey.latin}</span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">NO DRAVAS. AR PACIETĪBU.</span>
          <h2 id="detail-title">
            {honey.name}
            <br />
            <em>medus.</em>
          </h2>
          <p className="detail-story">{honey.story}</p>
          <div className="detail-character">
            {["Maigums", "Izteiksmīgums", "Garšas dziļums"].map((label, i) => (
              <div key={label}>
                <span>{label}</span>
                <div className="character-rule">
                  <i
                    style={{
                      width: `${honey.character[i]}%`,
                      background: honey.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <dl className="detail-facts">
            <div>
              <dt>Ievākuma laiks</dt>
              <dd>{honey.harvest}</dd>
            </div>
            <div>
              <dt>Sastāvs</dt>
              <dd>Medus</dd>
            </div>
            <div>
              <dt>Uz tava galda</dt>
              <dd>{honey.pairing}</dd>
            </div>
          </dl>
          <div className="detail-choices">
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
            <div className="quantity">
              <button
                aria-label="Samazināt daudzumu"
                disabled={qty <= 1}
                onClick={() => setQty((n) => Math.max(1, n - 1))}
              >
                −
              </button>
              <output aria-label="Daudzums">{qty}</output>
              <button
                aria-label="Palielināt daudzumu"
                onClick={() => setQty((n) => Math.min(99, n + 1))}
              >
                +
              </button>
            </div>
            <span className="detail-price">
              {money(honey.price * (weight === 500 ? 1 : 1.8) * qty)}
            </span>
          </div>
          <button
            className="add-button"
            onClick={() => onAdd(honey, weight, qty)}
          >
            Pievienot grozam <span>+</span>
          </button>
          <span className="detail-disclaimer">
            Šķirnes, iepakojums un cenas šeit ir maketa paraugi.
          </span>
        </div>
      </div>
    </div>
  );
}

export function Cart({
  items,
  onClose,
  onChange,
}: {
  items: CartItem[];
  onClose: () => void;
  onChange: (id: string, weight: number, delta: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(true, ref, onClose);
  const total = items.reduce(
    (sum, item) =>
      sum +
      honeys.find((h) => h.id === item.id)!.price *
        (item.weight === 500 ? 1 : 1.8) *
        item.qty,
    0,
  );
  return (
    <div
      className="overlay overlay--cart"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cart-caption" aria-hidden="true">
        Vasara.
        <br />
        Līdzņemšanai.
        <Bee />
      </div>
      <div
        className="receipt"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <Close onClick={onClose} />
        <div className="receipt-stamp">
          <img
            className="receipt-logo"
            src="./images/stupenu-medus-logo.png"
            alt="Stupēnu medus"
            width="208"
            height="180"
          />
          <span>
            LEJAS STUPĒNI
            <br />
            PIEBALGAS PUSĒ
          </span>
        </div>
        <span className="receipt-number">DRAVAS PASŪTĪJUMA LAPA / 001</span>
        <h2 id="cart-title">
          Tava burciņa.
          <br />
          <em>Tava vasara.</em>
        </h2>
        <div className="receipt-rule" />
        <div className="receipt-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <Bee />
              <h3>Pagaidām te ir klusums.</h3>
              <p>
                Izvēlies medu, un vasara
                <br />
                atradīs vietu arī tavā grozā.
              </p>
              <button className="text-button" onClick={onClose}>
                Pie medus <Arrow />
              </button>
            </div>
          ) : (
            items.map((item) => {
              const honey = honeys.find((h) => h.id === item.id)!;
              return (
                <div className="receipt-item" key={`${item.id}-${item.weight}`}>
                  <Jar honey={honey} weight={item.weight} />
                  <div className="receipt-item-copy">
                    <h3>{honey.name} medus</h3>
                    <span>
                      {item.weight === 500 ? "500 g" : "1 kg"} ·{" "}
                      {money(honey.price * (item.weight === 500 ? 1 : 1.8))}
                    </span>
                    <div className="quantity">
                      <button
                        aria-label={`Samazināt: ${honey.name}, ${item.weight} g`}
                        onClick={() => onChange(item.id, item.weight, -1)}
                      >
                        −
                      </button>
                      <output aria-label={`${honey.name} daudzums`}>
                        {item.qty}
                      </output>
                      <button
                        aria-label={`Palielināt: ${honey.name}, ${item.weight} g`}
                        onClick={() => onChange(item.id, item.weight, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="receipt-item-price">
                    {money(
                      honey.price * (item.weight === 500 ? 1 : 1.8) * item.qty,
                    )}
                  </span>
                  <button
                    className="receipt-remove"
                    onClick={() => onChange(item.id, item.weight, -item.qty)}
                    aria-label={`Izņemt: ${honey.name}, ${item.weight} g`}
                  >
                    Izņemt
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="receipt-total">
          <span>Kopā</span>
          <strong>{money(total)}</strong>
        </div>
        <button className="checkout-button" disabled>
          Noformēt pasūtījumu <Arrow />
        </button>
        <p className="receipt-disclaimer">
          Šis ir vizuāls makets.
          <br />
          Pasūtījumi un maksājumi vēl nav pieejami.
        </p>
        <button className="receipt-continue text-button" onClick={onClose}>
          Turpināt iepazīt medu <Arrow direction="left" />
        </button>
        <div className="receipt-bottom">
          <span>NO ZIEDA LĪDZ TAVAM GALDAM</span>
          <FlowerMark />
        </div>
      </div>
    </div>
  );
}

export function Menu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(true, ref, onClose);
  return (
    <div
      className="overlay overlay--menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="menu-sheet"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <Close onClick={onClose} />
        <span className="eyebrow" id="menu-title">
          VIENAS VASARAS PIERAKSTI
        </span>
        <nav>
          {[
            ["medus", "Medus"],
            ["drava", "Drava"],
            ["gads", "Bišu gads"],
            ["par-mums", "Par mums"],
            ["kontakti", "Kontakti"],
          ].map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={onClose}>
              <small>0{i + 1}</small>
              <span>{label}</span>
              <Arrow />
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <img
            className="menu-logo"
            src="./images/stupenu-medus-logo.png"
            alt="Stupēnu medus"
            width="208"
            height="180"
          />
          <span>
            Lejas Stupēni.
            <br />
            Piebalgas pusē, Latvijā.
          </span>
        </div>
      </div>
    </div>
  );
}
