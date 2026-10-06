import { useRef } from "react";
import { Arrow, Brand, FlowerMark } from "./Marks";
import { useScrollScene } from "../hooks/useMotion";

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  return (
    <>
      <section
        className="story"
        id="par-mums"
        ref={ref}
        aria-labelledby="story-title"
      >
        <div className="story-top">
          <span>05 / CILVĒKI AIZ BURCIŅAS</span>
          <span>LEJAS STUPĒNI</span>
        </div>
        <div className="story-photograph">
          <img
            src="./images/beekeeper.webp"
            alt="Dravas cilvēks biškopja tērpā, līdzās atpūšas suns"
            loading="lazy"
          />
          <span className="photo-caption">
            DRAVAS IKDIENA. BEZ IESTUDĒJUMA.
          </span>
          <span className="photo-corner photo-corner--one" />
          <span className="photo-corner photo-corner--two" />
        </div>
        <div className="story-text">
          <span className="story-eyebrow">PIEBALGAS PUSĒ, LATVIJĀ.</span>
          <h2 id="story-title">
            Maza drava.
            <br />
            <em>Īsta dzīve.</em>
          </h2>
          <p>
            Lejas Stupēni ir vieta, no kuras nāk šis medus. Ar koka stropiem,
            zāli ap dravu un ikdienas darbu, kas fotogrāfijā ne vienmēr izskatās
            glīti.
          </p>
          <p>
            Mēs nepārtaisām vasaru. Tikai saliekam burciņās to, ko bites
            atnesušas.
          </p>
          <a href="#kontakti" className="text-button">
            Iepazīsimies <Arrow />
          </a>
        </div>
        <div className="story-table">
          <img
            src="./images/table.webp"
            alt="Lejas Stupēnu medus uz galda līdzās vasaras ziediem"
            loading="lazy"
          />
          <span>No dravas — uz galda.</span>
        </div>
        <FlowerMark className="story-flower" />
      </section>
      <footer className="footer" id="kontakti">
        <div className="footer-top">
          <span>NO MŪSU DRAVAS</span>
          <span>UZ TAVA GALDA.</span>
        </div>
        <div className="footer-heading">
          Lai vasara
          <br />
          <em>paliek ilgāk.</em>
          <FlowerMark />
        </div>
        <div className="footer-contact">
          <span>PAR MEDU UN SATIKŠANOS</span>
          <p>
            Te drīzumā varēsi sazināties ar mums.
            <br />
            Pagaidām — iepazīsti dravu un atrodi savu medu.
          </p>
          <a href="#medus" className="text-button">
            Atpakaļ pie medus <Arrow direction="up" />
          </a>
        </div>
        <div className="footer-bottom">
          <Brand light />
          <span>VIZUĀLAIS PROTOTIPS · PASŪTĪJUMI VĒL NAV PIEEJAMI</span>
          <a href="#sakums" aria-label="Atgriezties sākumā">
            UZ AUGŠU <Arrow direction="up" />
          </a>
        </div>
        <div className="footer-credits">
          <span>
            Īstās dravas fotogrāfijas. Pļavas attēls — pagaidu vizualizācija.
          </span>
          <span>© {new Date().getFullYear()} Lejas Stupēni</span>
        </div>
      </footer>
    </>
  );
}
