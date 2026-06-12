import { createClient } from '@sanity/client'
import imageUrlBuilder  from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  // useCdn: true = nopea CDN-cache, sopii tuotantoon
  // useCdn: false = reaaliaikainen data, sopii kehitykseen
  useCdn: import.meta.env.PROD,
})

const builder = imageUrlBuilder(client)

/**
 * Palauttaa Sanity-kuvan URL:n halutussa koossa.
 * Käyttö: urlFor(image).width(800).url()
 */
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}

/**
 * Rakentaa tiedostoasset-referenssistä (esim. "file-abc123-pdf") suoran
 * lataus-URL:n Sanityn CDN:ään. Käytetään rikastekstin sisäisille
 * tiedostoliitteille, joiden asset-tietoja ei laajenneta GROQ:ssa.
 */
export function fileUrl(ref?: string): string {
  if (!ref) return ''
  const [, id, ext] = ref.split('-') // file-<id>-<ext>
  if (!id || !ext) return ''
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}
