import type { Language, Audience } from './queries'

// ── Kielet ────────────────────────────────────────────────────────────────────
// HUOM: Sanityn sisäinen kielikoodi ruotsille on historiallisista syistä 'se'
// (mm. dokumentti onePager-se). URL-poluissa ja HTML lang -attribuutissa
// käytetään aina oikeaa ISO 639-1 -koodia 'sv' ('se' tarkoittaa pohjoissaamea)
// — PATH_LANG hoitaa muunnoksen. Jos Sanity-data joskus migroidaan koodille
// 'sv', tämä mappaus voidaan poistaa.
export const LANGUAGES: Language[] = ['fi', 'se', 'en']
export const DEFAULT_LANGUAGE: Language = 'fi'

// Kielivalitsimen lyhenteet
export const LANG_LABEL: Record<Language, string> = { fi: 'FI', se: 'SV', en: 'EN' }

// Sisäinen kielikoodi → URL-polun/HTML langin ISO 639-1 -koodi
export const PATH_LANG: Record<Language, string> = { fi: 'fi', se: 'sv', en: 'en' }

/** URL-polun kielikoodi (esim. /sv/unga). */
export function pathLang(lang: Language): string {
  return PATH_LANG[lang]
}

/** HTML lang -attribuutti – sama ISO 639-1 -koodi kuin URL-poluissa. */
export function htmlLang(lang: Language): string {
  return PATH_LANG[lang]
}

/** Sivun polku: /<iso-kielikoodi>/<lokalisoitu kohderyhmäslug>. */
export function pagePath(lang: Language, audience: Audience): string {
  return `/${pathLang(lang)}/${audienceSlug(lang, audience)}`
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

// ── Amisfits-testin lokalisoitu URL-slug ─────────────────────────────────────
export const QUIZ_SLUGS: Record<Language, string> = {
  fi: 'testi',
  se: 'testet',
  en: 'test',
}

/** Testisivun polku: /<iso-kielikoodi>/<audience-slug>/<testi-slug>. */
export function quizPath(lang: Language, audience: Audience): string {
  return `${pagePath(lang, audience)}/${QUIZ_SLUGS[lang]}`
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
  // Amisfits-testi
  quizQuestionWord: string  // "Kysymys" (edistymisilmaisin: Kysymys 2/5)
  quizStart:        string  // aloituspainike
  quizPrev:         string
  quizNext:         string
  quizShowResult:   string
  quizChooseOne:    string  // validointiviesti
  quizRestart:      string
  quizBackToPage:   string
  quizComing:       string  // näytetään jos testiä ei vielä ole Sanityssä
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
    quizQuestionWord: 'Kysymys',
    quizStart:        'Aloita testi',
    quizPrev:         'Edellinen',
    quizNext:         'Seuraava',
    quizShowResult:   'Näytä tulos',
    quizChooseOne:    'Valitse yksi vaihtoehto ennen jatkamista.',
    quizRestart:      'Tee testi uudelleen',
    quizBackToPage:   'Takaisin etusivulle',
    quizComing:       'Testi julkaistaan pian – tervetuloa takaisin!',
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
    quizQuestionWord: 'Fråga',
    quizStart:        'Starta testet',
    quizPrev:         'Föregående',
    quizNext:         'Nästa',
    quizShowResult:   'Visa resultat',
    quizChooseOne:    'Välj ett alternativ innan du fortsätter.',
    quizRestart:      'Gör om testet',
    quizBackToPage:   'Tillbaka till startsidan',
    quizComing:       'Testet publiceras snart – välkommen tillbaka!',
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
    quizQuestionWord: 'Question',
    quizStart:        'Start the test',
    quizPrev:         'Previous',
    quizNext:         'Next',
    quizShowResult:   'Show my result',
    quizChooseOne:    'Please choose one option before continuing.',
    quizRestart:      'Retake the test',
    quizBackToPage:   'Back to the main page',
    quizComing:       'The test will be published soon – check back later!',
  },
}

/** Palauttaa käännössanakirjan kielelle (fallback oletuskieleen). */
export function t(lang: Language): Dict {
  return T[lang] ?? T[DEFAULT_LANGUAGE]
}
