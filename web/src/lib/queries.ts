import { client } from './sanity'

// ── Tyypit ────────────────────────────────────────────────────────────────────

export type Audience = 'nuoret' | 'aikuiset'
export type Language = 'fi' | 'se' | 'en'

export interface SanityBlock {
  _type: 'block' | 'image' | 'fileAttachment' | string
  [key: string]: unknown
}

export interface SanityImage {
  _key?:  string
  _type?: 'image'
  asset:  { _ref: string }
  alt?:   string
}

export interface Attachment {
  _key:   string
  title?: string
  asset?: {
    url?:              string
    originalFilename?: string
    extension?:        string
    size?:             number
  }
}

export interface Section {
  _key:             string
  displayHeadline?: string          // iso koristeellinen teksti ennen sektiota
  headline:         string
  backgroundColor:  'pink' | 'yellow' | 'blue'
  video?:           string
  testCtaUrl?:      string
  // Sisältö nuorille
  summaryYouth:      SanityBlock[]
  expandedYouth:     SanityBlock[]  // polku ammattikorkeakouluun
  expandedYouthUni:  SanityBlock[]  // polku yliopistoon
  // Sisältö aikuisopiskelijoille
  summaryAdult:      SanityBlock[]
  expandedAdult:     SanityBlock[]  // polku ammattikorkeakouluun
  expandedAdultUni:  SanityBlock[]  // polku yliopistoon
  // Erilliset liitteet
  images?:      SanityImage[]
  attachments?: Attachment[]
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

// ── Amisfits-testi ───────────────────────────────────────────────────────────

export type QuizColor = 'green' | 'yellow'

export interface QuizOption {
  _key:       string
  textYouth:  string
  textAdult?: string       // tyhjä = sama kuin nuorille
  colorYouth: QuizColor
  colorAdult: QuizColor
}

export interface QuizQuestion {
  _key:           string
  questionYouth:  string
  questionAdult?: string   // tyhjä = sama kuin nuorille
  options:        QuizOption[]
}

export interface QuizResult {
  _key:          string
  category:      QuizColor
  headingYouth?: string
  bodyYouth?:    SanityBlock[]
  sloganYouth?:  string
  headingAdult?: string
  bodyAdult?:    SanityBlock[]
  sloganAdult?:  string
}

export interface Quiz {
  _id:       string
  language:  Language
  titleYouth: string
  leadYouth?: string
  titleAdult?: string
  leadAdult?:  string
  questions: QuizQuestion[]
  results:   QuizResult[]
  ctaLabel?: string
  ctaUrl?:   string
}

// ── GROQ-kyselyt ─────────────────────────────────────────────────────────────

const ONE_PAGER_QUERY = /* groq */ `
  *[_type == "onePager" && language == $language][0] {
    _id,
    language,
    sections[] {
      _key,
      displayHeadline,
      headline,
      backgroundColor,
      video,
      testCtaUrl,
      summaryYouth,
      expandedYouth,
      expandedYouthUni,
      summaryAdult,
      expandedAdult,
      expandedAdultUni,
      images[] {
        _key,
        asset,
        alt
      },
      attachments[] {
        _key,
        title,
        "asset": file.asset->{
          url,
          originalFilename,
          extension,
          size
        }
      }
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

const QUIZ_QUERY = /* groq */ `
  *[_type == "quiz" && language == $language][0] {
    _id,
    language,
    titleYouth,
    leadYouth,
    titleAdult,
    leadAdult,
    questions[] {
      _key,
      questionYouth,
      questionAdult,
      options[] {
        _key,
        textYouth,
        textAdult,
        colorYouth,
        colorAdult
      }
    },
    results[] {
      _key,
      category,
      headingYouth,
      bodyYouth,
      sloganYouth,
      headingAdult,
      bodyAdult,
      sloganAdult
    },
    ctaLabel,
    ctaUrl
  }
`

/**
 * Hakee Amisfits-testin kielen perusteella.
 * Palauttaa null jos testiä ei ole vielä syötetty Sanityyn —
 * testisivu näyttää silloin "testi tulossa" -viestin.
 */
export async function getQuiz(language: Language): Promise<Quiz | null> {
  return client.fetch<Quiz | null>(QUIZ_QUERY, { language })
}
