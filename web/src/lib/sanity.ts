import { createClient } from '@sanity/client'
import imageUrlBuilder  from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   import.meta.env.PUBLIC_SANITY_DATASET   ?? 'production',
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
