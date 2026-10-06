import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

await mkdir('artifacts/motion', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
for (const [name, width, height] of [['laptop', 1366, 768], ['mobile', 390, 844]]) {
  for (const time of [60, 180, 360, 650]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto('http://127.0.0.1:5173')
    await page.locator('.pack-image').evaluate(image => image.decode())
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Pievienot grozam' }).click()
    await page.getByRole('button', { name: 'Atvērt grozu' }).click()
    await page.waitForTimeout(time)
    const scale = await page.locator('[data-order-brand]').evaluate(group => { const m = group.getScreenCTM(); return [m.a, m.d] })
    assert.ok(Math.abs(scale[0] - scale[1]) < .0001, 'The cart label stays uniform during the transition')
    await page.screenshot({ path: `artifacts/motion/${name}-cart-${time}.png` })
    await page.close()
  }
  for (const time of [100, 240, 500]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto('http://127.0.0.1:5173')
    await page.locator('.pack-image').evaluate(image => image.decode())
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    await page.getByRole('radio', { name: /Medus šūnās/ }).click()
    await page.waitForTimeout(time)
    const opacity = await page.locator('.product-slide, .pack, .product-photo').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))
    assert.ok(opacity.every(value => value === '1'), 'Buckets slide without any opacity fade')
    assert.equal(await page.locator('.product-wipe, .wipe-viewport').count(), 0)
    await page.screenshot({ path: `artifacts/motion/${name}-switch-${time}.png` })
    await page.close()
  }
}
await browser.close()
console.log('Captured desktop/mobile transitions; verified uniform cart geometry, fully opaque bucket slides and no curtain.')
