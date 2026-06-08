import { client } from './sanity'

// ── Tyypit ────────────────────────────────────────────────────────────────────

export type Audience = 'nuoret' | 'aikuiset'
export type Language = 'fi' | 'se' | 'en'

export interface SanityBlock {
  _type: 'block'
  [key: string]: unknown
}

export interface Section {
  _key:            string
  headline:        string
  backgroundColor: 'pink' | 'yellow' | 'blue'
  video?:          string
  // Sisältö nuorille
  summaryYouth:    SanityBlock[]
  expandedYouth:   SanityBlock[]
  // Sisältö aikuisopiskelijoille
  summaryAdult:    SanityBlock[]
  expandedAdult:   SanityBlock[]
  // CTA – AMISFITS-testi (lisätään myöhemmin)
  testCtaUrl?:     string
}

export interface FaqItem {
  _key:         string
  question:     string
  answerYouth:  SanityBlock[]
  answerAdult:  SanityBlock[]
}

export interface PartnerLogo {
  _key:  string
  asset: { _ref: string }
  alt?:  string
}

export interface OnePager {
  _id:          string
  language:     Language
  sections:     Section[]
  faq:          FaqItem[]
  partnerLogos: PartnerLogo[]
}

// ── GROQ-kyselyt ─────────────────────────────────────────────────────────────

const ONE_PAGER_QUERY = /* groq */ `
  *[_type == "onePager" && language == $language][0] {
    _id,
    language,
    sections[] {
      _key,
      headline,
      backgroundColor,
      video,
      summaryYouth,
      expandedYouth,
      summaryAdult,
      expandedAdult,
      testCtaUrl
    },
    faq[] {
      _key,
      question,
      answerYouth,
      answerAdult
    },
    partnerLogos[] {
      _key,
      asset,
      alt
    }
  }
`

/**
 * Tyhjä fallback-dokumentti, jota käytetään kun Sanity-datasetissä
 * ei vielä ole sisältöä (esim. ensimmäinen build ennen sisällön lisäystä).
 */
function emptyOnePager(language: Language): OnePager {
  return {
    _id:          `onePager-${language}`,
    language,
    sections:     [],
    faq:          [],
    partnerLogos: [],
  }
}

/**
 * Hakee oikean one-pager-dokumentin kielen perusteella.
 * Audience-ehtologiikka hoidetaan frontendin komponenteissa,
 * jotta molemmat versiot buildataan samasta datasta.
 * Palauttaa tyhjän placeholderin jos dokumenttia ei vielä löydy.
 */
export async function getOnePager(language: Language): Promise<OnePager> {
  const data = await client.fetch<OnePager | null>(ONE_PAGER_QUERY, { language })
  return data ?? emptyOnePager(language)
}
