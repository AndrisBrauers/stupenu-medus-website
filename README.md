# Lejas Stupēni — vasara, burciņā.

A Latvian honey farm visual prototype: a summer field journal that moves from meadow to hive to honey. Built with React, TypeScript, Vite, custom SVG and small, visibility-aware Canvas scenes.

## Run locally

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Verify

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright checks large desktop (1920 × 1080), laptop (1366 × 768) and mobile. It covers variety selection, weights, product details, cart arithmetic, empty-cart handling, the seasonal dial, honeycomb selection, keyboard focus, reduced motion and a real touch swipe. Set `PLAYWRIGHT_EXECUTABLE_PATH` to use an existing compatible Chromium installation.

## Publish

The `main` branch deploys to [GitHub Pages](https://andrisbrauers.github.io/stupenu-medus-website/) through `.github/workflows/deploy.yml`. The workflow builds and runs the browser checks before publishing `dist`. GitHub Pages must use **GitHub Actions** as its publishing source.

All URLs are relative so the production build works under the repository's Pages subdirectory. Product details are dialogs rather than routes; navigation uses native anchors.

## Creative and technical decisions

- A photographic cover, printed-looking annotations and Cormorant Garamond paired with Manrope. The locally hosted fonts include their SIL Open Font License files.
- Six-petalled flower geometry straightens into wax-cell geometry with scroll. The six explorable hive cells are a material study rather than a product grid.
- A circular seasonal instrument supports pointer rotation, taps and keyboard navigation. Its plants, captions and honey swatch change together.
- Honey is drawn as a thin translucent SVG thread; pointer movement bends its neck with a slow settling response.
- Each honey changes the paper, ink, botanical drawing and glass-jar contents. The jar uses layered SVG gradients, small bubbles, etched lid details, paper grain and shifting highlights. Mobile visitors swipe the jar to change varieties.
- Product details resemble a botanical plate. The cart is a perforated printed order slip. Dialogs contain focus, close with Escape and restore focus to the page.
- Native scrolling, no scroll hijacking. Scroll work uses animation frames and visibility observers. The pollen Canvas stops offscreen; the flower study only redraws on scroll. Reduced motion keeps the complete interface available.

`src/data.ts` contains the mocked assortment and prices. The cart exists only in memory. There is no backend, authentication, persistence, checkout, payment, shipping integration or order processing. Contact details are intentionally left as a visible future addition rather than invented.

## Images and provenance

The farm photographs come from the supplied local originals:

| Web asset                       | Original               |
| ------------------------------- | ---------------------- |
| `public/images/hive-small.webp` | `photos/IMG_8559.HEIC` |
| `public/images/beekeeper.webp`  | `photos/IMG_2466.jpg`  |
| `public/images/table.webp`      | `photos/IMG_7025.HEIC` |

The originals remain untouched. Web derivatives are resized WebP images without the original EXIF metadata. Only the web derivatives are published. The supplied `logo/Stupēnu medus (1).png` is copied unchanged to `public/images/stupenu-medus-logo.png` and used in the masthead, cover seal, footer, menu, order slip, favicon and every product label. The glass jar is a prototype packaging presentation.

The temporary meadow was generated using the **built-in imagegen tool** and saved as `public/images/meadow.webp`, with a mobile crop at `public/images/meadow-mobile.webp`. It is identified as a temporary visualization in the site footer. Replace both images with a real local meadow photograph when available.

<details>
<summary>Final meadow generation prompt</summary>

Use case: photorealistic-natural. Asset type: temporary panoramic background photograph for a bespoke Latvian honey farm website. Primary request: an exceptionally natural, believable, atmospheric photograph of a wild Latvian summer meadow in late June. Wide landscape aspect ratio 3:2. Camera very low amongst delicate white cow parsley, small daisies and slender native meadow grasses; foreground flowers sharp and textured, some grasses pleasantly out of focus, a hazy dark birch treeline sits along the upper fifth of the image. Early evening Nordic midsummer light, soft warm highlights and muted sage olive greens, pale ivory wildflowers, subdued light beige sky, understated film grain. A large, natural expanse of grasses with intimate plant texture; editorial documentary film photography, botanical rather than sentimental. Strong layered depth, quite dark muted green center and right with pale small flowers at edges. No people, no animals, no beehives, no text, no buildings, no dramatic sun orb, no artificial orange grade, no exaggerated bokeh, no lens flare, no oversaturated green. This must look like an actual photograph of an ordinary but quietly beautiful field, not a luxury stock image or a render.

</details>
