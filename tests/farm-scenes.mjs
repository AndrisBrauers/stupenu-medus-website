import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts/farm-scenes', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  for (const [width, height] of [[2560,1440], [1920,1080], [1440,900], [834,1194], [701,900], [700,900], [390,844], [320,568]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('http://127.0.0.1:5173')
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.querySelectorAll('.farm-content img')].map(image => { image.loading='eager'; return image.decode() }))
    })
    assert.equal(await page.locator('main section').count(), 4)
    assert.equal(await page.locator('.honeycomb image').count(), 0, 'Honeycombs contain no photo cutouts')
    const map = page.getByTitle('Lejas-Stupāni kartē', { exact: true })
    assert.match(await map.getAttribute('src'), /q=57\.07566582910709,25\.93807236034701.*output=embed/)
    const photoSizes = await page.locator('.farm-content figure img').evaluateAll(images => images.map(image => {
      const rect = image.getBoundingClientRect(), style = getComputedStyle(image)
      return { width: rect.width, height: rect.height, clip: style.clipPath, transform: style.transform, opacity: style.opacity }
    }))
    for (const photo of photoSizes) {
      assert.ok(photo.width <= 300 && photo.height <= 400, 'Farm photographs remain modest in size')
      assert.ok(Math.abs(photo.width / photo.height - .75) < .001, 'The complete original portrait stays visible')
      assert.equal(photo.clip, 'none'); assert.equal(photo.transform, 'none'); assert.equal(photo.opacity, '1')
    }
    const counts = await page.locator('.honeycomb').evaluateAll(elements => elements.filter(e => e.getBoundingClientRect().width > 0).map(e => Number(e.dataset.cellCount)))
    assert.ok(new Set(counts).size >= 3, 'Cluster size varies through the scenes')
    assert.ok(counts.includes(3) && counts.includes(2))
    if (width > 700) assert.ok(counts.includes(7))
    else assert.ok(counts.every(count => count <= 4), 'Mobile uses fewer cells per cluster')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)

    for (const [name, selector] of [['farm','.farm-scene'], ['receiving','.honey-counter'], ['location','.destination']]) {
      const target = await page.locator(selector).evaluate(element => Math.max(0, Math.min(document.documentElement.scrollHeight-innerHeight, element.getBoundingClientRect().top+scrollY-innerHeight*.12)))
      await page.evaluate(y => window.scrollTo(0,y), target)
      await page.waitForTimeout(120)
      assert.ok(Math.abs(await page.evaluate(() => scrollY)-target)<1, 'Native scroll remains free')
      assert.equal(await page.locator('.farm-room').evaluate(e=>getComputedStyle(e).clipPath), 'none', 'Scrolling never masks or reveals the photograph')
      if (name === 'location' && [1440,390].includes(width)) {
        const frame = await map.contentFrame()
        await frame.getByRole('region', { name: 'Karte' }).waitFor({ timeout: 15000 })
        await page.waitForTimeout(1500)
      }
      if ([1440,390].includes(width)) await page.screenshot({ path: `artifacts/farm-scenes/${width}-${name}.png` })
    }
    const collisions = await page.evaluate(() => {
      const text = [...document.querySelectorAll('.farm-content h2, .farm-content h3, .farm-content p, .farm-content a, .farm-content address, .farm-content dt, .farm-content dd')].flatMap(element => {
        const range = document.createRange(); range.selectNodeContents(element)
        return [...range.getClientRects()].map(rect => ({rect, name:element.textContent.slice(0,30)}))
      })
      const found = new Set()
      document.querySelectorAll('.comb-edges').forEach(path => {
        if (!path.getBoundingClientRect().width) return
        const matrix = path.getScreenCTM(), length = path.getTotalLength()
        for (let d=0; d<length; d+=3) {
          const p=path.getPointAtLength(d).matrixTransform(matrix)
          if (p.x < 0 || p.x > innerWidth) continue
          text.forEach(({rect,name})=>{if(p.x>rect.left+1 && p.x<rect.right-1 && p.y>rect.top+1 && p.y<rect.bottom-1)found.add(name)})
        }
      })
      return [...found]
    })
    assert.deepEqual(collisions, [], `${width}: cluster edges leave factual text and actions clear`)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForFunction(() => !document.querySelector('.honeycomb[data-motion="active"]'))
    await page.evaluate(() => window.scrollTo(0,0))
    await page.waitForTimeout(100)
    assert.equal(await page.locator('.farm-room').evaluate(e=>getComputedStyle(e).clipPath),'none')
    assert.equal(await page.locator('.honeycomb[data-motion="active"]').count(), 0)
    if ([1440,390].includes(width)) await page.screenshot({ path:`artifacts/farm-scenes/${width}-complete.png`,fullPage:true })
    console.log(`PASS ${width}: compact complete photos, inline map, varied clusters, readable text, native scroll and reduced motion`)
    await page.close()
  }
  assert.deepEqual(errors, [])
} finally { await browser.close() }
