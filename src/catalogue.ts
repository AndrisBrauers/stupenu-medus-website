import { assetUrl } from './assets'

// Honey capacities and prices are owner-confirmed. Honeycomb weight/price
// remain prototype data. Amounts are euro cents.
export interface ProductVariant {
  id: string
  size: string
  price: number
}

export interface Product {
  id: string
  name: string
  firstLine: string
  secondLine: string
  sizeRange: string
  variants: ProductVariant[]
  image: string
  scale: number
  label: { left: number; top: number; width: number; height: number }
}

export const products: Product[] = [
  {
    id: 'medus', name: 'Medus', firstLine: 'Stupēnu', secondLine: 'medus', sizeRange: '0,5–3 L',
    variants: [
      { id: 'medus-05l', size: '0,5 L', price: 500 },
      { id: 'medus-1l', size: '1 L', price: 1000 },
      { id: 'medus-2l', size: '2 L', price: 2000 },
      { id: 'medus-3l', size: '3 L', price: 3000 },
    ],
    image: assetUrl('products/ziedu-medus.webp'), scale: 0.88,
    label: { left: 0.332, top: 0.531, width: 0.326, height: 0.264 },
  },
  {
    id: 'sunu-medus', name: 'Medus šūnās', firstLine: 'Medus', secondLine: 'šūnās', sizeRange: '700 g',
    variants: [{ id: 'sunu-700', size: '700 g', price: 1200 }],
    image: assetUrl('products/sunu-medus.webp'), scale: 0.96,
    label: { left: 0.333, top: 0.49, width: 0.318, height: 0.273 },
  },
]

export const cartProducts = products.flatMap(product => product.variants.map(variant => ({
  ...variant, name: product.name, image: product.image,
})))

export const money = (cents: number) => new Intl.NumberFormat('lv-LV', {
  style: 'currency', currency: 'EUR',
}).format(cents / 100)
