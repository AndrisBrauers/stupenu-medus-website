import { StrictMode, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import './styles.css'
import { products, money } from './catalogue'
import { type Bounds } from './geometry'
import { BrandSilhouette } from './BrandSilhouette'
import { Cart, type CartItems } from './Cart'
import { Farm, SiteFooter } from './Farm'
import { assetUrl } from './assets'

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function App() {
  const [selected, setSelected] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [variantIds, setVariantIds] = useState<Record<string, string>>({})
  const [switchPhase, setSwitchPhase] = useState<'idle' | 'outgoing' | 'incoming'>('idle')
  const [cart, setCart] = useState<CartItems>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const reducedMotion = useReducedMotion()
  const labelOrigin = useRef<HTMLDivElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const switchTimers = useRef<number[]>([])
  const product = products[displayed]
  const variant = product.variants.find(item => item.id === variantIds[product.id]) ?? product.variants[0]
  const switching = switchPhase !== 'idle'
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)

  useEffect(() => {
    for (const image of new Set(products.map(item => item.image))) { const preload = new Image(); preload.src = image }
    return () => switchTimers.current.forEach(clearTimeout)
  }, [])

  function selectProduct(index: number) {
    if (index === selected) return
    switchTimers.current.forEach(clearTimeout)
    setSelected(index)
    setAdded(false)
    if (reducedMotion) { setDisplayed(index); setSwitchPhase('idle'); return }
    setSwitchPhase('outgoing')
    switchTimers.current = [
      window.setTimeout(() => { setDisplayed(index); setSwitchPhase('incoming') }, 150),
      window.setTimeout(() => setSwitchPhase('idle'), 480),
    ]
  }

  function openCart() {
    lastTrigger.current = document.activeElement as HTMLElement
    setCartOpen(true)
  }

  function addProduct() {
    if (added) { openCart(); return }
    setCart(current => ({ ...current, [variant.id]: Math.min(99, (current[variant.id] ?? 0) + 1) }))
    setAdded(true)
    setAnnouncement(`${product.name}, ${variant.size} pievienots grozam.`)
  }

  function origin(): Bounds {
    const rect = labelOrigin.current!.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  }

  return <>
    <div className="storefront" inert={cartOpen}>
      <header className="site-header">
        <img className="brand" src={assetUrl('brand/Stupēnu medus (1).png')} width="100" height="87" alt="Stupēnu Medus" />
        <button className="cart-trigger" onClick={openCart} disabled={switching} aria-label={`Grozs, ${count} preces`}>
          <svg width="17" height="20" viewBox="0 0 17 20" fill="none" aria-hidden="true"><path d="M1 6h15v13H1zM5 6V4a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" strokeWidth="1.3" /></svg>
          Grozs <span className="cart-count" key={count}>{count}</span>
        </button>
      </header>
      <main>
      <section className="product-stage" aria-label="Izvēlies savu medu" id="medus">
        <div className="brand-composition" aria-hidden="true">
          <div className="brand-extension" />
          <BrandSilhouette className="brand-surface" />
        </div>
        <div className="product-info" data-phase={switchPhase}>
          <p className="eyebrow">Latvijas medus</p>
          <div className="product-copy changing" aria-live="polite" aria-atomic="true">
            <h1>{product.firstLine}<br />{product.secondLine}<span className="yellow">.</span></h1>
            <div className="product-facts">
              {product.variants.length > 1 ? <label className="bucket-size">
                <span>Tilpums</span>
                <select aria-label={`${product.name} tilpums`} value={variant.id} disabled={switching} onChange={event => {
                  setVariantIds(current => ({ ...current, [product.id]: event.target.value }))
                  setAdded(false)
                }}>
                  {product.variants.map(item => <option key={item.id} value={item.id}>{item.size}</option>)}
                </select>
              </label> : <span className="weight">{variant.size}</span>}
              <span className="price">{money(variant.price)}</span>
            </div>
          </div>
          <button className={`action purchase ${added ? 'is-added' : ''}`} onClick={addProduct} disabled={switching}>
            {added ? 'Atvērt grozu' : 'Pievienot grozam'}<span aria-hidden="true">{added ? '→' : '+'}</span>
          </button>
        </div>
        <div className="product-display" data-switching={switching} data-phase={switchPhase}>
          {products.map((item, index) => <div key={item.id} className="product-slide" data-active={index === selected}
            aria-hidden={index !== selected} style={{ '--slide-offset': `${(index - selected) * 115}%` } as CSSProperties}>
            <div className="product-shadow" style={{ '--pack-scale': item.scale } as CSSProperties} />
            <div className="pack" style={{ '--pack-scale': item.scale } as CSSProperties}>
              <img className={`product-photo${index === selected ? ' pack-image' : ''}`} src={item.image}
                alt={`${item.name} Stupēnu Medus spainītī`} width="1280" height="1280" fetchPriority={index === 0 ? 'high' : 'auto'} draggable="false" />
              <div ref={index === selected ? labelOrigin : undefined} className="label-origin" aria-hidden="true"
                style={{ left: `${item.label.left * 100}%`, top: `${item.label.top * 100}%`, width: `${item.label.width * 100}%`, height: `${item.label.height * 100}%` }} />
            </div>
          </div>)}
        </div>
        <div className="product-selector" role="radiogroup" aria-label="Medus veids">
          {products.map((item, index) => <button key={item.id} role="radio" aria-checked={selected === index} tabIndex={selected === index ? 0 : -1}
            className="product-option" onClick={() => selectProduct(index)} onKeyDown={event => {
              let next = index
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % products.length
              else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + products.length - 1) % products.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = products.length - 1
              else return
              event.preventDefault()
              selectProduct(next)
              const group = event.currentTarget.parentElement
              ;(group?.children[next] as HTMLButtonElement)?.focus()
            }}>
            <span>{item.name}</span><span className="option-weight">{item.sizeRange}</span>
          </button>)}
        </div>
      </section>
      <Farm reducedMotion={reducedMotion} />
      </main>
      <SiteFooter />
    </div>
    <div className="sr-only" role="status">{announcement}</div>
    {cartOpen && <Cart items={cart} origin={origin} reducedMotion={reducedMotion}
      onQuantity={(id, quantity) => { setCart(current => ({ ...current, [id]: Math.max(0, Math.min(99, quantity)) })); setAdded(false) }}
      onClose={() => { setCartOpen(false); requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true })) }} />}
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
