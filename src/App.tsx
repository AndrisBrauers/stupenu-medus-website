import { useCallback, useEffect, useRef, useState } from "react";
import type { Honey } from "./data";
import Hero from "./components/Hero";
import Apiary from "./components/Apiary";
import Seasons from "./components/Seasons";
import Pour from "./components/Pour";
import Shop from "./components/Shop";
import Story from "./components/Story";
import { Brand } from "./components/Marks";
import {
  Cart,
  Menu,
  ProductDetail,
  type CartItem,
} from "./components/Overlays";

export default function App() {
  const [overlay, setOverlay] = useState<"cart" | "detail" | "menu" | null>(
    null,
  );
  const [detail, setDetail] = useState<Honey | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [added, setAdded] = useState(false);
  const addTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const close = useCallback(() => setOverlay(null), []);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const add = useCallback((honey: Honey, weight: number, qty: number) => {
    setItems((current) => {
      const existing = current.find(
        (i) => i.id === honey.id && i.weight === weight,
      );
      return existing
        ? current.map((i) =>
            i === existing ? { ...i, qty: Math.min(99, i.qty + qty) } : i,
          )
        : [...current, { id: honey.id, weight, qty }];
    });
    setAdded(true);
    setOverlay("cart");
    clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 1800);
  }, []);
  useEffect(() => () => clearTimeout(addTimer.current), []);
  const change = useCallback(
    (id: string, weight: number, delta: number) =>
      setItems((current) =>
        current
          .map((i) =>
            i.id === id && i.weight === weight
              ? { ...i, qty: Math.min(99, i.qty + delta) }
              : i,
          )
          .filter((i) => i.qty > 0),
      ),
    [],
  );
  return (
    <>
      <div
        className={`page-shell ${overlay ? "has-overlay" : ""}`}
        inert={overlay !== null}
      >
        <a className="skip-link" href="#medus">
          Pāriet pie medus
        </a>
        <header className="header">
          <Brand />
          <nav className="header-links" aria-label="Galvenā navigācija">
            <a href="#medus">Medus</a>
            <a href="#drava">Drava</a>
            <a href="#gads">Bišu gads</a>
          </nav>
          <div className="header-actions">
            <button
              className="menu-trigger"
              onClick={() => setOverlay("menu")}
              aria-label="Atvērt izvēlni"
            >
              <span />
              <span />
            </button>
            <button
              className={`cart-trigger ${added ? "is-added" : ""}`}
              onClick={() => setOverlay("cart")}
              aria-label={`Atvērt grozu, ${count} burciņas`}
            >
              <span>Grozs</span>
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </header>
        <main>
          <Hero />
          <Apiary />
          <Seasons />
          <Pour />
          <Shop
            onDetail={(honey) => {
              setDetail(honey);
              setOverlay("detail");
            }}
            onAdd={add}
          />
          <Story />
        </main>
      </div>
      {overlay === "detail" && detail ? (
        <ProductDetail honey={detail} onClose={close} onAdd={add} />
      ) : overlay === "cart" ? (
        <Cart items={items} onClose={close} onChange={change} />
      ) : overlay === "menu" ? (
        <Menu onClose={close} />
      ) : null}
      <div className="sr-only" aria-live="polite">
        {added ? `Medus pievienots grozam. Grozā ${count} burciņas.` : ""}
      </div>
    </>
  );
}
