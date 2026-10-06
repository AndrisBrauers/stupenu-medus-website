import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { combLayouts, createHoneycomb, type CombLayout } from './honeycombGeometry'

type Props = { layout: CombLayout; mobileLayout?: CombLayout; className: string; seed: number; drop?: boolean; reducedMotion: boolean }

export function Honeycomb({ layout, mobileLayout, className, seed, drop, reducedMotion }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const id = `comb-${useId().replace(/[^a-z0-9_-]/gi, '')}`
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 700px)').matches)
  const mesh = useMemo(() => createHoneycomb(combLayouts[mobile && mobileLayout ? mobileLayout : layout], 30, seed), [layout, mobileLayout, mobile, seed])
  const { x, y, width, height } = mesh.bounds
  useEffect(() => {
    const media = matchMedia('(max-width: 700px)'), update = () => setMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const element = ref.current!, scene = element.closest('section')!
    let inView = false, frame = 0, reset = 0, pointer = { x: 0, y: 0 }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) element.dataset.seen = 'true'
    }, { rootMargin: '40px' })
    observer.observe(element)
    const move = (event: Event) => {
      const e = event as PointerEvent
      if (reducedMotion || !inView || e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = element.getBoundingClientRect()
        const dx = pointer.x - rect.x - rect.width / 2, dy = pointer.y - rect.y - rect.height / 2
        const near = Math.max(0, 1 - Math.hypot(dx, dy) / (rect.width + 100))
        element.style.setProperty('--comb-x', `${(dx / Math.max(1, rect.width) * near * 2).toFixed(2)}px`)
        element.style.setProperty('--comb-y', `${(dy / Math.max(1, rect.height) * near * 2).toFixed(2)}px`)
        element.dataset.warm = near > .35 ? 'true' : 'false'
      })
    }
    const leave = () => {
      element.style.setProperty('--comb-x', '0px'); element.style.setProperty('--comb-y', '0px'); element.dataset.warm = 'false'
    }
    const touch = (event: Event) => {
      if (reducedMotion || !inView) return
      const e = event as PointerEvent, rect = element.getBoundingClientRect()
      if (Math.hypot(e.clientX - rect.x - rect.width / 2, e.clientY - rect.y - rect.height / 2) > rect.width) return
      element.dataset.warm = 'true'
      clearTimeout(reset); reset = window.setTimeout(leave, 900)
    }
    scene.addEventListener('pointermove', move, { passive: true })
    scene.addEventListener('pointerleave', leave)
    scene.addEventListener('pointerdown', touch, { passive: true })
    return () => {
      observer.disconnect(); scene.removeEventListener('pointermove', move); scene.removeEventListener('pointerleave', leave); scene.removeEventListener('pointerdown', touch)
      cancelAnimationFrame(frame); clearTimeout(reset)
    }
  }, [reducedMotion])
  return <div ref={ref} className={`honeycomb ${className}`} style={{ '--comb-width': `${width + 16}px` } as CSSProperties} aria-hidden="true" data-cell-count={mesh.cells.length} data-motion={reducedMotion ? 'still' : 'active'}>
    <svg viewBox={`${x - 8} ${y - 8} ${width + 16} ${height + (drop ? 27 : 16)}`} fill="none" focusable="false">
      <defs>
        <linearGradient id={`${id}-amber`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#ffdb68" stopOpacity=".12"/><stop offset=".5" stopColor="#f0ad18" stopOpacity=".42"/><stop offset="1" stopColor="#a95608" stopOpacity=".62"/></linearGradient>
        <linearGradient id={`${id}-light`}><stop stopColor="#fff1bc" stopOpacity="0"/><stop offset=".49" stopColor="#fff2c9" stopOpacity=".55"/><stop offset=".58" stopColor="#fff5d7" stopOpacity="0"/></linearGradient>
        <clipPath id={`${id}-whole`}><path d={mesh.silhouette}/></clipPath>
        {mesh.cells.map((cell, i) => <clipPath key={i} id={`${id}-${i}`}><path d={cell.d}/></clipPath>)}
      </defs>
      <g className="comb-body">
        {mesh.cells.map((cell, i) => {
          const filmY = cell.cy + ((i * 11 + seed * 7) % 29) - 14
          return <g key={i} data-cell={i} clipPath={`url(#${id}-${i})`}>
            {(i + seed) % 3 !== 1 && <g className="comb-film" style={{ transitionDelay: `${i * 55}ms` }}>
              <path d={`M${cell.cx - 40} ${filmY} Q${cell.cx} ${filmY + 6} ${cell.cx + 40} ${filmY - 2} V${cell.cy + 40} H${cell.cx - 40}Z`} fill={`url(#${id}-amber)`}/>
              <path d={`M${cell.cx - 34} ${filmY} Q${cell.cx} ${filmY + 5} ${cell.cx + 34} ${filmY - 1}`} stroke="#fff1bb" strokeOpacity=".6" strokeWidth=".7"/>
            </g>}
          </g>
        })}
        <g clipPath={`url(#${id}-whole)`}><rect className="comb-sheen" x={x - width} y={y - 10} width={width * 2} height={height + 20} fill={`url(#${id}-light)`}/></g>
        <path d={mesh.outline} stroke={`url(#${id}-amber)`} strokeWidth="3.6" opacity=".32"/>
        <path className="comb-edges" d={mesh.outline}/>
        {drop && <g transform={`translate(${mesh.bottom.x} ${mesh.bottom.y + 1}) scale(.36)`}><path className="comb-drop" d="M0 0C0 9-9 16-9 22C-9 34 9 34 9 22C9 16 0 9 0 0Z" fill="#fbba00"/></g>}
      </g>
    </svg>
  </div>
}
