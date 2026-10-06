import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const sizes = [
  ['wide', 2560, 1440],
  ['desktop', 1920, 1080],
  ['laptop', 1440, 900],
  ['tablet', 834, 1194],
  ['mobile', 390, 844],
  ['narrow', 320, 568],
]
for (const [name, width, height] of sizes) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  page.on('pageerror', error => console.error(name, error))
  await page.goto('http://127.0.0.1:5173')
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.pack-image').evaluate(image => image.decode())
  await page.locator('.farm-content img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
  await page.screenshot({ path: `artifacts/${name}.png` })
  // Freeze the decorative honey glaze for whole-page stills.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.screenshot({ path: `artifacts/${name}-homepage.png`, fullPage: true })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const geometry = await page.locator('[data-brand-silhouette]').evaluate(svg => {
    const rect = svg.getBoundingClientRect()
    const matrix = svg.getScreenCTM()
    return { ratio: rect.width / rect.height, scaleX: matrix.a, scaleY: matrix.d, viewBox: svg.getAttribute('viewBox') }
  })
  assert.ok(Math.abs(geometry.ratio - 208 / 180) < .001, `${name}: intrinsic brand ratio`)
  assert.ok(Math.abs(geometry.scaleX - geometry.scaleY) < .0001, `${name}: uniformly scaled path`)
  assert.equal(geometry.viewBox, '0 0 208 180')
  assert.equal(await page.locator('.product-wipe, .wipe-viewport').count(), 0)
  await page.getByRole('radio', { name: /Medus šūnās/ }).click()
  await page.locator('.product-display[data-switching="false"]').waitFor()
  await page.screenshot({ path: `artifacts/${name}-honeycomb.png` })
  await page.getByRole('button', { name: 'Pievienot grozam' }).click()
  await page.getByRole('button', { name: 'Atvērt grozu' }).click()
  await page.locator('.order[data-state="open"]').waitFor()
  const cartScale = await page.locator('[data-order-brand]').evaluate(group => { const matrix = group.getScreenCTM(); return { x: matrix.a, y: matrix.d } })
  assert.ok(Math.abs(cartScale.x - cartScale.y) < .0001, `${name}: uniform cart geometry`)
  await page.screenshot({ path: `artifacts/${name}-cart.png`, fullPage: true })
  console.log(name, { ...geometry, ...await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, height: innerHeight, pageHeight: document.documentElement.scrollHeight })) })
  await page.close()
}
await browser.close()
