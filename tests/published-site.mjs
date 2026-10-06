import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { setTimeout } from 'node:timers/promises'

const url = process.env.SITE_URL || 'http://127.0.0.1:4173/stupenu-medus-website/'
const server = process.env.SITE_URL ? null : spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort', '--base', '/stupenu-medus-website/'], { stdio: 'ignore' })
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 40; attempt++) {
    try { ready = (await fetch(url)).ok } catch { /* Wait for the preview server. */ }
    if (ready) break
    await setTimeout(250)
  }
  assert.ok(ready, `Site is reachable: ${url}`)
  browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome', headless: true })
  for (const [width, height] of [[1440,900], [390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => {
      if (response.url().startsWith(new URL(url).origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    await page.goto(url)
    await page.getByRole('combobox', { name: 'Medus tilpums' }).selectOption('medus-2l')
    assert.match(await page.locator('.price').innerText(), /20,00/)
    await page.getByRole('button', { name: 'Pievienot grozam' }).click()
    await page.getByRole('radio', { name: /Medus šūnās/ }).click()
    await page.getByRole('button', { name: 'Pievienot grozam' }).click()
    await page.getByRole('button', { name: 'Atvērt grozu' }).click()
    assert.equal((await page.locator('[data-testid="total"]').innerText()).replace(/\s/g, ''), '32,00€')
    await page.getByRole('button', { name: 'Noformēt pasūtījumu' }).click()
    assert.match(await page.locator('.checkout-notice').innerText(), /Pasūtījumi vēl netiek pieņemti/)
    await page.locator('.order img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'detached' })
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
    const images = await page.locator('img').evaluateAll(images => images.map(image => ({ loaded: image.naturalWidth > 0, path: new URL(image.src).pathname })))
    assert.ok(images.every(image => image.loaded && image.path.startsWith('/stupenu-medus-website/')), 'All images load under the Pages subpath')
    const favicon = await page.locator('link[rel="icon"]').getAttribute('href')
    assert.equal((await page.request.get(new URL(favicon, url).href)).status(), 200)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)
    assert.deepEqual(errors, [])
    console.log(`PASS ${width}px: deployed assets, prices, cart and mock checkout at ${url}`)
    await page.close()
  }
} finally {
  await browser?.close()
  server?.kill()
}
