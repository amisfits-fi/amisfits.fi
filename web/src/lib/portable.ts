import { toHTML } from '@portabletext/to-html'
import { urlFor, fileUrl } from './sanity'
import type { SanityBlock, Language } from './queries'

// ── HTML-escape – estetään attribuuttien rikkoutuminen / injektio ─────────────
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Lukujen muotoilu kielen mukaan ───────────────────────────────────────────
// fi/sv: 14 682 ja 33,3 (välilyönti on sitova, ei katkea rivin vaihtoon)
// en:    14,682 ja 33.3
const LOCALE: Record<Language, string> = { fi: 'fi-FI', se: 'sv-FI', en: 'en-GB' }

function formatNumber(n: number, lang: Language): string {
  return new Intl.NumberFormat(LOCALE[lang] ?? 'fi-FI', { maximumFractionDigits: 1 }).format(n)
}

function formatUnit(unit: string | undefined, lang: Language): string {
  if (!unit) return ''
  // Suomessa ja ruotsissa prosenttimerkin eteen tulee välilyönti, englannissa ei
  const space = unit === '%' && lang === 'en' ? '' : ' '
  return `${space}${esc(unit)}`
}

// Yksilöllinen id aria-viittauksia varten (Sanityn _key on uniikki taulukossa)
function idFrom(prefix: string, key: unknown): string {
  const k = String(key ?? '').replace(/[^A-Za-z0-9_-]/g, '')
  if (!k) return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
  return k.startsWith(`${prefix}-`) ? k : `${prefix}-${k}`
}

// ── Tietolaatikon ja kaavion sisäinen teksti: vain perusmuotoilut ja linkit ──
const innerComponents = {}

function makeComponents(lang: Language) {
  return {
    types: {
      // Tekstin sisään upotettu kuva (sijoittelu: koko leveys / oikea / vasen)
      image: ({ value }: { value: any }) => {
        if (!value?.asset?._ref) return ''
        const place = value.placement === 'left' || value.placement === 'right' ? value.placement : 'full'
        const width = place === 'full' ? 1200 : 800
        const src = urlFor(value).width(width).fit('max').auto('format').url()
        const alt = esc(value.alt)
        const caption = value.alt
          ? `<figcaption class="rt-image__caption">${alt}</figcaption>`
          : ''
        return `<figure class="rt-image rt-image--${place}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" />${caption}</figure>`
      },

      // Tekstin sisään upotettu tiedostoliite (PDF tms.)
      fileAttachment: ({ value }: { value: any }) => {
        const ref = value?.file?.asset?._ref
        const href = fileUrl(ref)
        if (!href) return ''
        const label = esc(value.title || 'Lataa tiedosto')
        return `<a class="rt-file" href="${href}" download>📎 ${label}</a>`
      },

      // Tietolaatikko ("Tiesitkö?", "Huomio!")
      infoBox: ({ value }: { value: any }) => {
        const title = esc(value?.title)
        const body  = value?.body?.length ? toHTML(value.body, { components: innerComponents }) : ''
        if (!title && !body) return ''
        const place = value.placement === 'left' || value.placement === 'full' ? value.placement : 'right'
        const tilt  = value.tilted === false ? '' : ' infobox--tilted'
        const id    = idFrom('ib', value._key)
        return (
          `<aside class="infobox infobox--${place}${tilt}" aria-labelledby="${id}">` +
            `<div class="infobox__inner">` +
              (title ? `<p class="infobox__title" id="${id}">${title}</p>` : '') +
              `<div class="infobox__body">${body}</div>` +
            `</div>` +
          `</aside>`
        )
      },

      // Vaakapylväskaavio – oikeaa tekstiä, palkit CSS:llä
      barChart: ({ value }: { value: any }) => {
        const rows = (Array.isArray(value?.rows) ? value.rows : [])
          .filter((r: any) => r && r.label && typeof r.value === 'number' && r.value >= 0)
        if (!rows.length) return ''

        const max  = Math.max(...rows.map((r: any) => r.value)) || 1
        const unit = formatUnit(value.unit, lang)
        const id   = idFrom('chart', value._key)

        const rowsHTML = rows.map((r: any) => {
          const share = (r.value / max).toFixed(4)
          const note  = r.note ? `<span class="chart__note">${esc(r.note)}</span>` : ''
          return (
            `<li class="chart__row${r.highlight ? ' chart__row--hl' : ''}">` +
              `<span class="chart__label">${esc(r.label)}</span>` +
              `<span class="chart__track">` +
                `<span class="chart__bar" style="--share:${share}" aria-hidden="true"></span>` +
                `<span class="chart__value">${formatNumber(r.value, lang)}${unit}</span>` +
              `</span>` +
              note +
            `</li>`
          )
        }).join('')

        const title   = value.title   ? `<p class="chart__title" id="${id}-t">${esc(value.title)}</p>` : ''
        const source  = value.source  ? `<p class="chart__source">${esc(value.source)}</p>` : ''
        const caption = value.caption ? `<figcaption class="chart__caption" id="${id}-c">${esc(value.caption)}</figcaption>` : ''
        const aria    = [
          value.title   ? `aria-labelledby="${id}-t"`  : '',
          value.caption ? `aria-describedby="${id}-c"` : '',
        ].filter(Boolean).join(' ')

        return (
          `<figure class="chart"${aria ? ' ' + aria : ''}>` +
            `<div class="chart__card">` +
              title +
              `<ul class="chart__rows" role="list">${rowsHTML}</ul>` +
              source +
            `</div>` +
            caption +
          `</figure>`
        )
      },
    },
  }
}

/**
 * Renderöi Portable Text -lohkot HTML:ksi, mukaan lukien tekstin sisäiset
 * kuvat, tiedostoliitteet, tietolaatikot ja pylväskaaviot.
 * Kieli vaikuttaa kaavioiden lukujen muotoiluun (14 682 vs. 14,682).
 * Palauttaa tyhjän merkkijonon jos lohkoja ei ole.
 */
export function renderPT(blocks?: SanityBlock[], lang: Language = 'fi'): string {
  return blocks?.length ? toHTML(blocks as any, { components: makeComponents(lang) }) : ''
}
