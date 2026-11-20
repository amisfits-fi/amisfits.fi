import { createClient } from '@sanity/client'
import imageUrlBuilder  from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  // useCdn: false MYÖS tuotannossa — tämä on staattinen sivusto, joten
  // Sanityä kysytään vain kerran buildin aikana, ei jokaisella kävijällä.
  // CDN-cachesta ei siis ole hyötyä, mutta siitä on haittaa: Sanity-webhook
  // laukaisee buildin sekunneissa julkaisun jälkeen, ja apicdn ehtii palauttaa
  // vielä vanhan sisällön. Silloin build onnistuu mutta paistaa sivustolle
  // julkaisua edeltävän version — eikä mikään laukaise uutta buildia.
  // (Osui 24.8.2026: julkaisu klo 14.04.22, build klo 14.04, kuvat jäivät pois.)
  useCdn: false,
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

/**
 * Kuvan leveys ja korkeus img-elementin width/height-attribuuteiksi.
 * Mitat luetaan asset-viitteestä (image-<id>-<leveys>x<korkeus>-<pääte>) ja
 * skaalataan samaan enimmäisleveyteen kuin kuvan URL. Kun mitat ovat HTML:ssä,
 * selain varaa kuvalle tilan etukäteen eikä sivu hypähdä kuvan latautuessa.
 * Palauttaa tyhjän objektin, jos mittoja ei saada selville.
 */
export function imageDims(image: any, maxWidth: number): { width?: number; height?: number } {
  const m = String(image?.asset?._ref ?? '').match(/-(\d+)x(\d+)-[a-z0-9]+$/i)
  if (!m) return {}
  let w = Number(m[1])
  let h = Number(m[2])
  const c = image?.crop
  if (c) {
    w *= 1 - (c.left ?? 0) - (c.right ?? 0)
    h *= 1 - (c.top ?? 0) - (c.bottom ?? 0)
  }
  if (!(w > 0) || !(h > 0)) return {}
  const scale = w > maxWidth ? maxWidth / w : 1
  return { width: Math.round(w * scale), height: Math.round(h * scale) }
}
