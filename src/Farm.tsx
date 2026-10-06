import { Honeycomb } from './Honeycomb'
import { assetUrl } from './assets'
import './farm.css'

// Producer/address/email: physical label. Receiving methods: owner-confirmed.
const email = 'stupeni@inbox.lv'
// Public address point, address-register code 104611116:
// https://www.firmas.lv/lv/uznemumi/lejas-stupani-madonas-rajona-liezeres-pagasta/57101005191
const mapQuery = '57.07566582910709,25.93807236034701'

export function Farm({ reducedMotion }: { reducedMotion: boolean }) {
  return <div className="farm-content">
    <section className="farm-story" id="par-mums" aria-labelledby="about-title">
      <Honeycomb layout="three" className="comb-drift-first" seed={2} reducedMotion={reducedMotion}/>
      <div className="farm-scene">
        <div className="farm-caption">
          <h2 id="about-title">Par mums</h2>
          <p className="farm-statement">Stupēnu Medus ir biškopības saimniecība Madonas novadā.</p>
          <p className="farm-facts">Mūsu saimniecība Z/S “Lejas-Stupāni” atrodas Liezēres pagastā, Piebalgas pusē. Piedāvājam medu un medu šūnās.</p>
          <a className="scene-link" href="#kontakti">Sazinies ar mums <span aria-hidden="true">↗</span></a>
        </div>
        <div className="farm-portrait">
          <figure className="farm-room"><img src={assetUrl('farm/biskopis.webp')} width="1200" height="1600" loading="eager" decoding="async" alt="Biškopis Lejas-Stupānu mājās uzvelk cimdus; līdzās uz dīvāna atpūšas suns."/></figure>
          <Honeycomb layout="three" className="comb-portrait-top" seed={4} reducedMotion={reducedMotion}/>
          <Honeycomb layout="seven" mobileLayout="four" className="comb-portrait-bottom" seed={7} drop reducedMotion={reducedMotion}/>
        </div>
      </div>
    </section>
    <section className="honey-counter" id="sanemsana" aria-labelledby="receiving-title">
      <Honeycomb layout="three" className="comb-drift-lower" seed={11} reducedMotion={reducedMotion}/>
      <div className="counter-copy">
        <div className="counter-heading"><h2 id="receiving-title">Kā saņemt medu</h2><p>Izvēlies medu un raksti mums par pasūtījumu.</p></div>
        <ul className="receiving-places">
          <li><h3>Saimniecībā</h3><p>Saņem medu pie mums Lejas-Stupānos, iepriekš vienojoties par laiku.</p></li>
          <li><h3>Pakomātā</h3><p>Par pakomātu un piegādi vienosimies, sazinoties.</p></li>
        </ul>
        <div className="counter-order"><a className="scene-link" href={`mailto:${email}?subject=${encodeURIComponent('Medus pasūtījums')}`}>Rakstīt par pasūtījumu <span aria-hidden="true">↗</span></a><p>Pasūtījumu noformēšana internetā vēl nav pieejama.</p></div>
      </div>
      <div className="counter-picture">
        <figure className="counter-photo"><img src={assetUrl('farm/medus-saimnieciba.webp')} width="1200" height="1600" loading="lazy" decoding="async" alt="Stupēnu Medus spainīši uz saimniecības galda līdzās lauku ziediem un zemenēm."/></figure>
        <Honeycomb layout="two" className="comb-table-left" seed={13} reducedMotion={reducedMotion}/>
        <Honeycomb layout="three" className="comb-table-top" seed={17} reducedMotion={reducedMotion}/>
        <Honeycomb layout="five" mobileLayout="three" className="comb-table-bottom" seed={19} drop reducedMotion={reducedMotion}/>
      </div>
    </section>
    <section className="destination" id="kontakti" aria-labelledby="contact-title">
      <div className="destination-inner">
        <h2 id="contact-title">Kur mūs atrast</h2>
        <div className="arrival">
        <div className="arrival-details"><h3>Z/S “Lejas-Stupāni”</h3><address>Liezēres pagasts<br/>Madonas novads</address><a className="destination-email" href={`mailto:${email}`}>{email}</a>
          <a className="scene-link map-link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" aria-label="Meklēt Lejas-Stupāni, Liezēres pagasts, Madonas novads kartē (atveras jaunā cilnē)">Atvērt kartē <span aria-hidden="true">↗</span></a>
          <dl className="contact-placeholders"><div><dt>Tālrunis</dt><dd>Tiks pievienots</dd></div><div><dt>Sociālie tīkli</dt><dd>Saites tiks pievienotas</dd></div></dl>
        </div>
        <div className="farm-map"><iframe title="Lejas-Stupāni kartē" src={`https://maps.google.com/maps?q=${mapQuery}&z=14&hl=lv&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div>
        </div>
      </div>
    </section>
  </div>
}

export function SiteFooter() {
  return <footer className="farm-footer"><a href="#medus" aria-label="Stupēnu Medus — atgriezties pie produktiem">STUPĒNU MEDUS <span aria-hidden="true">↑</span></a><span>Z/S “Lejas-Stupāni”</span><span>© 2026</span></footer>
}
