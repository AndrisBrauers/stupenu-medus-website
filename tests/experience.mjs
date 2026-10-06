import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
const price = async () => (await page.locator('[data-testid="total"]').textContent()).replace(/\s/g, '')
const waitForSwitch = () => page.locator('.product-display[data-switching="false"]').waitFor()
const openOrder = async () => {
  await page.getByRole('button', { name: /^Grozs,/ }).click()
  await page.locator('.order[data-state="open"]').waitFor()
}
const closeOrder = async () => {
  await page.keyboard.press('Escape')
  await page.getByRole('dialog').waitFor({ state: 'detached' })
}

try {
  await page.goto('http://127.0.0.1:5173')
  await page.getByRole('radiogroup').waitFor()
  assert.equal(await page.getByRole('radio').count(), 2, 'Exactly two actual product types')
  await openOrder()
  assert.match(await page.getByRole('dialog').innerText(), /Grozs vēl ir tukšs/)
  await closeOrder()
  assert.match(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), /^Grozs,/)

  await page.getByRole('button', { name: 'Pievienot grozam' }).click()
  await page.getByRole('radio', { name: /Medus šūnās/ }).click()
  await waitForSwitch()
  assert.match(await page.locator('.pack-image').getAttribute('src'), /sunu-medus/)
  assert.match(await page.locator('h1').innerText(), /šūnās/)
  await page.getByRole('button', { name: 'Pievienot grozam' }).click()
  await page.getByRole('button', { name: 'Atvērt grozu' }).click()
  await page.locator('.order[data-state="open"]').waitFor()
  assert.equal(await page.locator('.order-line').count(), 2)
  assert.equal(await price(), '17,00€', 'Both products can be purchased together')

  await page.getByRole('button', { name: 'Palielināt: Medus, 0,5 L', exact: true }).click()
  assert.equal(await price(), '22,00€', 'Quantity changes update the total in cents')
  await page.getByRole('button', { name: 'Noņemt: Medus šūnās, 700 g', exact: true }).click()
  assert.equal(await price(), '10,00€')
  await page.getByRole('button', { name: 'Noformēt pasūtījumu' }).click()
  assert.match(await page.locator('.checkout-notice').innerText(), /Pasūtījumi vēl netiek pieņemti/)

  // Keyboard focus cannot escape the open order surface.
  await page.getByRole('button', { name: 'Aizvērt' }).focus()
  await page.keyboard.press('Shift+Tab')
  assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Noformēt pasūtījumu ↗')
  await page.keyboard.press('Tab')
  assert.match(await page.evaluate(() => document.activeElement?.textContent), /Aizvērt/)
  await page.getByRole('button', { name: 'Samazināt: Medus, 0,5 L', exact: true }).click()
  await page.getByRole('button', { name: 'Samazināt: Medus, 0,5 L', exact: true }).click()
  assert.match(await page.getByRole('dialog').innerText(), /Grozs vēl ir tukšs/)
  await closeOrder()

  // Capacities are distinct order lines, with independently editable quantities.
  await page.getByRole('radio').nth(0).click()
  await waitForSwitch()
  const sizes = page.getByRole('combobox', { name: 'Medus tilpums' })
  assert.deepEqual(await sizes.locator('option').allTextContents(), ['0,5 L', '1 L', '2 L', '3 L'])
  for (const [id, amount] of [['medus-05l','5,00'], ['medus-1l','10,00'], ['medus-2l','20,00'], ['medus-3l','30,00']]) {
    await sizes.selectOption(id)
    assert.ok((await page.locator('.price').innerText()).includes(amount))
    await page.getByRole('button', { name: 'Pievienot grozam' }).click()
  }
  await openOrder()
  assert.equal(await page.locator('.order-line').count(), 4)
  assert.deepEqual(await page.locator('.order-weight').allTextContents(), ['0,5 L', '1 L', '2 L', '3 L'])
  assert.equal(await price(), '65,00€')
  await page.getByRole('button', { name: 'Palielināt: Medus, 2 L', exact: true }).click()
  assert.equal(await price(), '85,00€')
  await page.getByRole('button', { name: 'Noņemt: Medus, 1 L', exact: true }).click()
  assert.equal(await price(), '75,00€')
  assert.equal(await page.locator('.quantity').filter({ has: page.getByRole('button', { name: 'Palielināt: Medus, 2 L', exact: true }) }).locator('output').innerText(), '2')
  await closeOrder()

  // Rapid selection must settle on the latest product, with matching price/image.
  for (let index = 0; index < 6; index++) await page.getByRole('radio').nth(index % 2).click()
  await waitForSwitch()
  assert.match(await page.locator('h1').innerText(), /šūnās/)
  assert.match(await page.locator('.price').innerText(), /12,00/)
  await page.getByRole('radio').nth(1).focus()
  await page.keyboard.press('ArrowLeft')
  await waitForSwitch()
  assert.equal(await page.getByRole('radio').nth(0).getAttribute('aria-checked'), 'true')
  assert.match(await page.locator('.price').innerText(), /30,00/)
  assert.equal(await sizes.inputValue(), 'medus-3l', 'The selected capacity survives switching product types')

  for (const [width, height] of [[2560, 1440], [1920, 1080], [1440, 900], [834, 1194], [390, 844], [320, 568]]) {
    await page.setViewportSize({ width, height })
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      purchase: document.querySelector('.purchase').getBoundingClientRect().bottom,
      selector: document.querySelector('.product-selector').getBoundingClientRect().bottom,
      height: innerHeight,
    }))
    assert.equal(metrics.overflow, false, `${width}px has no horizontal overflow`)
    assert.ok(metrics.purchase <= metrics.height, `${width}px purchase action is visible in the first viewport`)
    assert.ok(metrics.selector <= metrics.height, `${width}px product choices are visible in the first viewport`)
    await openOrder()
    await page.setViewportSize({ width: width + 10, height })
    await closeOrder()
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('radio').nth(1).click()
  assert.match(await page.locator('h1').innerText(), /šūnās/)
  await openOrder()
  await closeOrder()
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')
  // Start the contact scenario fresh after repeatedly resizing an open cart.
  await page.reload()
  await page.getByRole('link', { name: 'Sazinies ar mums', exact: true }).click()
  await page.waitForURL('**/#kontakti')
  assert.equal(await page.evaluate(() => location.hash), '#kontakti')
  assert.match(await page.locator('.arrival-details').innerText(), /Liezēres pagasts/)
  assert.equal(await page.locator('.destination-email').getAttribute('href'), 'mailto:stupeni@inbox.lv')
  assert.match(await page.locator('.map-link').getAttribute('href'), /google\.com\/maps\/search/)
  assert.equal(await page.locator('.receiving-places li').count(), 2)
  assert.match(await page.locator('.receiving-places').innerText(), /Saimniecībā[\s\S]*Pakomātā/)
  assert.equal(await page.locator('.contact-placeholders a').count(), 0, 'Unknown contact details are not dead links')
  await page.getByRole('link', { name: 'Stupēnu Medus — atgriezties pie produktiem' }).click()
  await page.waitForURL('**/#medus')
  assert.equal(await page.evaluate(() => location.hash), '#medus')
  assert.deepEqual(errors, [], 'No browser errors or failed assets')
  console.log('PASS: both products, all four honey sizes and prices, separate variant quantities, totals, removal, empty cart, mock checkout, focus trap, Escape, keyboard selection, rapid switching, six viewport sizes, resize, reduced motion and contact links.')
} finally {
  await browser.close()
}
