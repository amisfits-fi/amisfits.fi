import type { Language, Audience } from './queries'

// ── Kielet ────────────────────────────────────────────────────────────────────
export const LANGUAGES: Language[] = ['fi', 'se', 'en']
export const DEFAULT_LANGUAGE: Language = 'fi'

// Kielivalitsimen lyhenteet (huom: ruotsi näytetään 'SV', vaikka sisäinen koodi on 'se')
export const LANG_LABEL: Record<Language, string> = { fi: 'FI', se: 'SV', en: 'EN' }

/**
 * HTML lang -attribuutti. Sisäinen koodi 'se' (Sanity + reitit) → oikea
 * BCP47-koodi 'sv' ruotsille (se = pohjoissaame). Muut kielet sellaisenaan.
 */
export function htmlLang(lang: Language): string {
  return lang === 'se' ? 'sv' : lang
}

// ── Kohderyhmät ja lokalisoidut URL-slugit ───────────────────────────────────
export const AUDIENCES: Audience[] = ['nuoret', 'aikuiset']

// Kanoninen audience-avain ('nuoret'/'aikuiset') → URL-slug per kieli
export const AUDIENCE_SLUGS: Record<Language, Record<Audience, string>> = {
  fi: { nuoret: 'nuoret', aikuiset: 'aikuiset' },
  se: { nuoret: 'unga',   aikuiset: 'vuxna'   },
  en: { nuoret: 'youth',  aikuiset: 'adults'  },
}

export function audienceSlug(lang: Language, audience: Audience): string {
  return AUDIENCE_SLUGS[lang][audience]
}

export function audienceFromSlug(lang: Language, slug: string): Audience | undefined {
  const map = AUDIENCE_SLUGS[lang]
  return (Object.keys(map) as Audience[]).find((a) => map[a] === slug)
}

// ── Käännökset ───────────────────────────────────────────────────────────────
interface Dict {
  audienceLabel:   Record<Audience, string>
  pathUas:         string   // polku ammattikorkeakouluun
  pathUni:         string   // polku yliopistoon
  videoComing:     string
  testLead:        string
  testButton:      string
  faqHeading:      string
  partnerLogoAlt:  string
  metaDescription: string
  footerPre:       string   // teksti ennen Sivista-linkkiä
  footerPost:      string   // teksti linkin jälkeen
}

export const T: Record<Language, Dict> = {
  fi: {
    audienceLabel:   { nuoret: 'Peruskoulunuoret', aikuiset: 'Aikuisopiskelijat' },
    pathUas:         'Ammattikorkeakouluun',
    pathUni:         'Yliopistoon',
    videoComing:     'Video tulossa',
    testLead:        'Sopiiko amis sinulle?',
    testButton:      'Tee 2 min AMISFITS-testi →',
    faqHeading:      'Usein kysyttyä amiksesta',
    partnerLogoAlt:  'Kumppanilogo',
    metaDescription: 'Amisfits – ammatillinen tutkinto antaa etumatkaa',
    footerPre:       'Sivustoa ylläpitää ',
    footerPost:      ' – ammatillisen koulutuksen työnantaja- ja toimialajärjestö.',
  },
  se: {
    audienceLabel:   { nuoret: 'Grundskoleelever', aikuiset: 'Vuxenstuderande' },
    pathUas:         'Till yrkeshögskolan',
    pathUni:         'Till universitetet',
    videoComing:     'Video kommer',
    testLead:        'Passar yrkesutbildning dig?',
    testButton:      'Gör AMISFITS-testet på 2 min →',
    faqHeading:      'Vanliga frågor om yrkesutbildning',
    partnerLogoAlt:  'Partnerlogotyp',
    metaDescription: 'Amisfits – en yrkesexamen ger dig ett försprång',
    footerPre:       'Webbplatsen upprätthålls av ',
    footerPost:      ' – arbetsgivar- och branschorganisation för yrkesutbildning.',
  },
  en: {
    audienceLabel:   { nuoret: 'Comprehensive school students', aikuiset: 'Adult learners' },
    pathUas:         'To a university of applied sciences',
    pathUni:         'To university',
    videoComing:     'Video coming',
    testLead:        'Is vocational school right for you?',
    testButton:      'Take the 2-min AMISFITS test →',
    faqHeading:      'Frequently asked questions about vocational school',
    partnerLogoAlt:  'Partner logo',
    metaDescription: 'Amisfits – a vocational qualification gives you a head start',
    footerPre:       'This site is maintained by ',
    footerPost:      ' – the employer and industry association for vocational education.',
  },
}

/** Palauttaa käännössanakirjan kielelle (fallback oletuskieleen). */
export function t(lang: Language): Dict {
  return T[lang] ?? T[DEFAULT_LANGUAGE]
}
