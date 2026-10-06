import { useEffect, useRef, useState } from 'react'
import { cartProducts, money } from './catalogue'
import { expandedPlacement, interpolatePlacement, labelPlacement, type Bounds } from './geometry'
import { BrandPaths } from './BrandSilhouette'
import { assetUrl } from './assets'

export type CartItems = Record<string, number>

export function Cart({ items, origin, reducedMotion, onQuantity, onClose }: {
  items: CartItems
  origin: () => Bounds
  reducedMotion: boolean
  onQuantity: (id: string, quantity: number) => void
  onClose: () => void
}) {
  const [phase, setPhase] = useState<'opening' | 'open' | 'closing'>('opening')
  const [checkoutNotice, setCheckoutNotice] = useState(false)
  const label = useRef<SVGGElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const progress = useRef(0)
  const closeRef = useRef(onClose)
  const originRef = useRef(origin)
  closeRef.current = onClose
  originRef.current = origin
  const lineItems = cartProducts.filter(product => items[product.id] > 0)
  const total = lineItems.reduce((sum, product) => sum + product.price * items[product.id], 0)

  function close() { setPhase('closing') }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus({ preventScroll: true })
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setPhase('closing') }
      if (event.key === 'Tab') {
        const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)') ?? [])
          .filter(element => element.getClientRects().length > 0)
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (!dialog.current?.contains(document.activeElement)) { event.preventDefault(); first?.focus() }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', keyboard)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', keyboard)
    }
  }, [])

  useEffect(() => {
    if (!dialog.current?.contains(document.activeElement)) closeButton.current?.focus({ preventScroll: true })
  }, [lineItems.length])

  useEffect(() => {
    let frame = 0
    const from = progress.current
    const to = phase === 'closing' ? 0 : 1
    const source = labelPlacement(originRef.current())
    const start = performance.now()
    const duration = reducedMotion ? 0 : phase === 'closing' ? 460 : 620
    const draw = () => {
      const placement = interpolatePlacement(source, expandedPlacement(), progress.current)
      label.current?.setAttribute('transform', `translate(${placement.x} ${placement.y}) scale(${placement.scale})`)
    }
    const tick = (time: number) => {
      const elapsed = duration === 0 ? 1 : Math.min(1, (time - start) / duration)
      const eased = elapsed * elapsed * (3 - 2 * elapsed)
      progress.current = from + (to - from) * eased
      draw()
      if (elapsed < 1) frame = requestAnimationFrame(tick)
      else if (phase === 'closing') closeRef.current()
      else if (phase === 'opening') setPhase('open')
    }
    draw()
    if (phase !== 'open') frame = requestAnimationFrame(tick)
    window.addEventListener('resize', draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', draw)
    }
  }, [phase, reducedMotion])

  return (
    <div ref={dialog} className="order" role="dialog" aria-modal="true" aria-labelledby="cart-title"
      data-state={phase}>
      <svg className="order-surface" aria-hidden="true"><g ref={label} data-order-brand><BrandPaths /></g></svg>
      <div className="order-content">
        <div className="order-top">
          <img src={assetUrl('brand/Stupēnu medus (1).png')} alt="Stupēnu Medus" width="90" height="78" />
          <button ref={closeButton} className="text-button close-order" onClick={close}>
            Aizvērt <span className="close-symbol" aria-hidden="true">×</span>
          </button>
        </div>
        <div className="order-layout">
          <div className="order-heading">
            <h2 id="cart-title">Tavs<br />grozs<span className="yellow">.</span></h2>
            <button className="text-button continue-button" onClick={close}><span aria-hidden="true">←</span> Turpināt izvēlēties</button>
          </div>
          <div className="order-details">
            {lineItems.length ? <>
              <div className="order-lines">
                {lineItems.map(product => <article className="order-line" key={product.id}>
                  <img className="order-product" src={product.image} alt="" width="104" height="104" />
                  <div className="order-product-info">
                    <h3>{product.name}</h3>
                    <span className="order-weight">{product.size}</span>
                    <div className="quantity" aria-label={`${product.name}, ${product.size}: daudzums`}>
                      <button aria-label={`Samazināt: ${product.name}, ${product.size}`} onClick={() => onQuantity(product.id, items[product.id] - 1)}>−</button>
                      <output aria-live="polite">{items[product.id]}</output>
                      <button aria-label={`Palielināt: ${product.name}, ${product.size}`} disabled={items[product.id] >= 99} onClick={() => onQuantity(product.id, items[product.id] + 1)}>+</button>
                    </div>
                  </div>
                  <div className="order-line-end">
                    <span className="line-price">{money(product.price * items[product.id])}</span>
                    <button className="remove-item" aria-label={`Noņemt: ${product.name}, ${product.size}`} onClick={() => onQuantity(product.id, 0)}>Noņemt</button>
                  </div>
                </article>)}
              </div>
              <div className="order-total"><span>Kopā</span><strong data-testid="total">{money(total)}</strong></div>
              <button className="action checkout" onClick={() => setCheckoutNotice(true)}>Noformēt pasūtījumu <span aria-hidden="true">↗</span></button>
              {checkoutNotice && <p className="checkout-notice" role="status">Šis ir vizuāls prototips. Pasūtījumi vēl netiek pieņemti.</p>}
            </> : <div className="empty-cart"><p>Grozs vēl ir tukšs.</p><button className="action" onClick={close}>Izvēlēties medu <span aria-hidden="true">↗</span></button></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
