import { toHTML } from '@portabletext/to-html'
import { urlFor, fileUrl } from './sanity'
import type { SanityBlock } from './queries'

// ── HTML-escape – estetään attribuuttien rikkoutuminen / injektio ─────────────
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Mukautetut renderöijät kuville ja tiedostoliitteille ──────────────────────
const components = {
  types: {
    // Tekstin sisään upotettu kuva
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return ''
      const src = urlFor(value).width(1200).fit('max').auto('format').url()
      const alt = esc(value.alt)
      const caption = value.alt
        ? `<figcaption class="rt-image__caption">${alt}</figcaption>`
        : ''
      return `<figure class="rt-image"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" />${caption}</figure>`
    },
    // Tekstin sisään upotettu tiedostoliite (PDF tms.)
    fileAttachment: ({ value }: { value: any }) => {
      const ref = value?.file?.asset?._ref
      const href = fileUrl(ref)
      if (!href) return ''
      const label = esc(value.title || 'Lataa tiedosto')
      return `<a class="rt-file" href="${href}" download>📎 ${label}</a>`
    },
  },
}

/**
 * Renderöi Portable Text -lohkot HTML:ksi, mukaan lukien tekstin sisäiset
 * kuvat ja tiedostoliitteet. Palauttaa tyhjän merkkijonon jos lohkoja ei ole.
 */
export function renderPT(blocks?: SanityBlock[]): string {
  return blocks?.length ? toHTML(blocks as any, { components }) : ''
}
