import { rm } from 'node:fs/promises'

// Publish the web assets, leaving original reference files in the repository.
const references = [
  'photos',
  'brand/Etiketes_Stupenu_medus-visi_izmeri (1) (1).pdf',
  'products/ziedu-medus.png',
  'products/sunu-medus.png',
  'products/provenance.json',
]
await Promise.all(references.map(path => rm(new URL(`../dist/${path}`, import.meta.url), { recursive: true, force: true })))
