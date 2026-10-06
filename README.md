# Stupēnu Medus — homepage prototype

The approved “The label opens” direction, built with React, TypeScript, Vite, CSS and an SVG label transformation. The two purchasable products are **Medus** and **Medus šūnās**, both in plastic containers.

## Run

```sh
npm install
npm run dev
```

The default local address is http://127.0.0.1:5173. `npm run build` checks TypeScript and builds the static frontend. `npm run preview` serves the build.

## Shareable mockup

GitHub Pages: https://andrisbrauers.github.io/stupenu-medus-website/

Pushing `main` runs `.github/workflows/deploy.yml`: it builds for the repository subpath, checks the production assets and mock checkout in Chromium, then deploys to Pages. No orders or payments are submitted. Original reference photos, label PDFs and source product PNGs are omitted from the published bundle; the website uses the optimized WebP assets.

To check the same build locally:

```sh
npm run build:pages
node tests/published-site.mjs
```

Set `SITE_URL` when running the last command to check the published site instead. Normal local development continues to use `/`; `src/assets.ts` resolves images against Vite's configured base.

## Scope and prototype data

The homepage has four areas: the product stage, a factual farm introduction, receiving options, and location/contact details, followed by a minimal footer. The shop includes product selection, add to cart, quantity changes, removal, an empty cart and the label-to-order transition. The cart is held in memory; reloading clears it. Checkout only displays a prototype notice and never submits an order.

Honey capacities and prices are owner-confirmed: **0.5 L — €5, 1 L — €10, 2 L — €20, 3 L — €30**. A volume selector updates the price, remembers the selection when switching products, and adds each capacity as a separate cart line. The honeycomb product's 700 g weight and €12 price remain unconfirmed prototype values. Catalogue data lives in `src/catalogue.ts`. There is no backend, payment or delivery integration.

Farm pickup and parcel-machine delivery were confirmed by the owner. The producer name, parish, region and email come from the supplied label PDF. Phone and social accounts are explicitly labeled, non-interactive placeholders as requested. The embedded Google map and its external link use the public address point for Lejas Stupāni (address-register code 104611116), sourced from the [farm's Firmas.lv listing](https://www.firmas.lv/lv/uznemumi/lejas-stupani-madonas-rajona-liezeres-pagasta/57101005191). Using the coordinates avoids the failed text-address search. The map requires an internet connection.

The lower-page photographs are real supplied photos, converted to WebP without generated changes: `IMG_2466.jpg` → `public/farm/biskopis.webp` and `IMG_7025.HEIC` → `public/farm/medus-saimnieciba.webp`. Both retain their complete portrait framing and stay at modest sizes, with the beekeeper and dog visible together. They have no scroll reveal, masking, zooming or fade. Receiving options use a straightforward two-option layout, followed by contact details and an inline map.

The real logo is used unchanged. The two isolated product images are **AI-prepared temporary assets**, based on the supplied photographs and label PDF. They preserve the clear plastic packaging direction but are not pixel-exact documentary reproductions; replace them with approved product photographs before launch. The honey photo is not evidence of a particular floral variety, so the visible product name is simply “Medus.”

`public/products/provenance.json` records source assets, saved paths, the built-in imagegen tool and the final prompts. PNGs are retained as high-resolution source assets; the site serves smaller WebP copies. To replace an image, update the catalogue image path, presentation scale, and normalized `label` bounds used as the cart-animation origin.

## Review and checks

With the dev server running and Google Chrome installed:

```sh
npm test
node tests/inspect.mjs
node tests/motion.mjs
node tests/farm-scenes.mjs
node --experimental-strip-types tests/honeycomb-geometry.mjs
```

The functional browser checks cover purchasing both products together, integer-cent totals, quantity changes, removal, empty state, mock checkout, keyboard/focus behavior, rapid switching, resizing, reduced motion, receiving options and contact links. The screenshot matrix is 2560×1440, 1920×1080, 1440×900, 834×1194, 390×844 and 320×568. The screenshot scripts write locally to the ignored `artifacts/` directory.

`BrandSilhouette.tsx` uses immutable paths and a fixed `0 0 208 180` viewBox based on the supplied logo. Its width changes uniformly with intrinsic height; a separate black rectangle extends the composition without stretching the mark. The cart shares the exact same paths and animates only translation and uniform scale. Browser checks verify equal horizontal/vertical scale at every viewport and during the transition.

Product selection slides the two fully opaque containers horizontally through the same display area, with their shadows and ground line preserved. Permanent slides allow an interrupted transition to reverse smoothly. There is no curtain, wipe or bucket fade. Reduced-motion preferences bypass sliding and the cart transformation.

## Honeycomb accents

The warm lower page keeps irregularly placed groups of real six-sided cells, including three- and seven-cell clusters. Plain honeycomb fragments loosely hold two corners of the beekeeper portrait and three corners of the table photograph, with a couple of smaller groups in the margins. The photographs sit above the honeycombs; the cells peek out onto the surrounding page and contain no photo cutouts. Whole fragments vary in size and angle; there is no repeating divider arrangement. `honeycombGeometry.ts` creates each shared vertex and edge once, then applies a small deterministic variation, so the cells fit together without triangular holes. `Honeycomb.tsx` adds translucent amber fills, a brief light sweep and slight pointer movement. The accents never intercept clicks or control scrolling.

Mobile uses smaller, fewer cells per cluster. Reduced motion keeps the glaze static. Photos, headings, receiving options and contact details remain in normal document flow; only the small decorative accents use absolute positioning.

The farm layout checks cover eight viewport widths, including both sides of the mobile breakpoint. They check complete portrait framing, modest photo dimensions, the inline map, text clearance around the cells, native scrolling and reduced motion. Screenshots are in `artifacts/farm-scenes/`. Geometry checks cover six-sided convex cells, shared edges and a connected mesh with no gaps.
