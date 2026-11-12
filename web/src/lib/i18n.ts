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

/** Sivun polku: /<iso-kielikoodi>/<lokalisoitu kohderyhmäslug>/.
 *  Loppukauttaviiva mukana, jotta linkit eivät kulje Netlifyn 301-ohjauksen kautta. */
export function pagePath(lang: Language, audience: Audience): string {
  return `/${pathLang(lang)}/${audienceSlug(lang, audience)}/`
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

/** Testisivun polku: /<iso-kielikoodi>/<audience-slug>/<testi-slug>/. */
export function quizPath(lang: Language, audience: Audience): string {
  return `${pagePath(lang, audience)}${QUIZ_SLUGS[lang]}/`
}

// ── Tietosivut (tietosuojaseloste, saavutettavuusseloste) ───────────────────
export type InfoPage = 'privacy' | 'accessibility'

export const INFO_SLUGS: Record<Language, Record<InfoPage, string>> = {
  fi: { privacy: 'tietosuoja', accessibility: 'saavutettavuus' },
  se: { privacy: 'dataskydd',  accessibility: 'tillganglighet' },
  en: { privacy: 'privacy',    accessibility: 'accessibility'  },
}

/** Tietosivun polku: /<iso-kielikoodi>/<slug>/ (staattiset sivut src/pages/<kieli>/). */
export function infoPath(lang: Language, page: InfoPage): string {
  return `/${pathLang(lang)}/${INFO_SLUGS[lang][page]}/`
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
  // Mukana olevat oppilaitokset (sivun alaosa)
  institutionsHeading: string
  institutionsMore:    string   // linkki listan perässä: kaikki oppilaitokset Opintopolussa
  institutionsMoreUrl: string   // Opintopolun etusivu sivun kielellä
  newTab:          string   // ruudunlukijalle: linkki avautuu uuteen välilehteen
  metaDescription: string
  slogan:          string   // kampanjan pääviesti: sivun otsikko ja jakotiedot
  themeAlt:        Record<1 | 2 | 3, string>  // teemagrafiikoiden koko teksti (alt), sama kuin SVG:ssä
  ogLocale:        string
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
  // Evästebanneri (CookieConsent.astro)
  consentTitle:      string
  consentText:       string
  consentPolicyLink: string
  consentPolicyUrl:  string   // tietosuojaseloste sivun kielellä; tyhjänä linkkiä ei näytetä
  consentAccept:     string
  consentDeny:       string
  consentSettings:   string   // footerin linkki, avaa bannerin uudelleen
  // Footerin linkit tietosivuille
  privacyLink:       string
  accessibilityLink: string
  backToFront:       string   // tietosivun lopussa: takaisin etusivulle
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
    institutionsHeading: 'Mukana olevat oppilaitokset',
    institutionsMore:    'Kaikki ammatilliset oppilaitokset löydät Opintopolusta',
    institutionsMoreUrl: 'https://opintopolku.fi/konfo/fi/',
    newTab:          '(avautuu uuteen välilehteen)',
    metaDescription: 'Amis antaa suunnan – käytännön kokemus ja työelämätaidot ovat todellinen kilpailuetu. Tee 2 minuutin Amisfits-testi.',
    slogan:          'Amis antaa suunnan',
    themeAlt: {
      1: 'Amis antaa suunnan. Käytännön kokemus ja työelämätaidot ovat todellinen kilpailuetu.',
      2: 'Amis avaa ovia. Ammatillinen tutkinto antaa saman jatko-opintokelpoisuuden kuin lukio.',
      3: 'Amis aktivoi unelmasi. Kurkistuskurssit, väyläopinnot ja avoin AMK tuovat varmuutta valintaan.',
    },
    ogLocale:        'fi_FI',
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
    consentTitle:      'Evästeet',
    consentText:       'Käytämme Google Analyticsia sivuston kehittämiseen, jos hyväksyt tilastoevästeet. Tiedot ovat tilastollisia, eikä niitä käytetä mainontaan. Voit muuttaa valintaasi milloin tahansa sivun alareunan Evästeasetukset-linkistä.',
    consentPolicyLink: 'Lue tietosuojaseloste',
    consentPolicyUrl:  '/fi/tietosuoja/',
    consentAccept:     'Hyväksy tilastoevästeet',
    consentDeny:       'Vain välttämättömät',
    consentSettings:   'Evästeasetukset',
    privacyLink:       'Tietosuojaseloste',
    accessibilityLink: 'Saavutettavuusseloste',
    backToFront:       '← Takaisin etusivulle',
  },
  se: {
    audienceLabel:   { nuoret: 'Grundskoleelever', aikuiset: 'Vuxenstuderande' },
    pathUas:         'Till yrkeshögskolan',
    pathUni:         'Till universitetet',
    videoComing:     'Video kommer',
    testLead:        'Passar yrkesutbildning dig?',
    testButton:      'Gör AMISFITS-testet på 2 min →',
    faqHeading:      'Vanliga frågor om yrkesutbildning',
    institutionsHeading: 'Medverkande läroanstalter',
    institutionsMore:    'Alla yrkesläroanstalter hittar du på Studieinfo',
    institutionsMoreUrl: 'https://opintopolku.fi/konfo/sv/',
    newTab:          '(öppnas i en ny flik)',
    metaDescription: 'Amis visar vägen – praktisk erfarenhet och arbetslivsfärdigheter är en verklig konkurrensfördel. Gör Amisfits-testet på 2 minuter.',
    slogan:          'Amis visar vägen',
    themeAlt: {
      1: 'Amis visar vägen. Praktisk erfarenhet och arbetslivsfärdigheter är en verklig konkurrensfördel.',
      2: 'Amis öppnar dörrar. En yrkesexamen ger samma behörighet för fortsatta studier som gymnasiet.',
      3: 'Amis aktiverar dina drömmar. Prova på-kurser, ledstudier samt öppna yrkeshögskole- och universitetsstudier ger trygghet inför ditt val.',
    },
    ogLocale:        'sv_FI',
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
    consentTitle:      'Kakor',
    consentText:       'Om du godkänner statistikkakor använder vi Google Analytics för att utveckla webbplatsen. Uppgifterna är statistiska och används inte för marknadsföring. Du kan ändra ditt val när som helst via länken Kakinställningar längst ner på sidan.',
    consentPolicyLink: 'Läs dataskyddsbeskrivningen',
    consentPolicyUrl:  '/sv/dataskydd/',
    consentAccept:     'Godkänn statistikkakor',
    consentDeny:       'Endast nödvändiga',
    consentSettings:   'Kakinställningar',
    privacyLink:       'Dataskyddsbeskrivning',
    accessibilityLink: 'Tillgänglighetsutlåtande',
    backToFront:       '← Tillbaka till startsidan',
  },
  en: {
    audienceLabel:   { nuoret: 'Comprehensive school students', aikuiset: 'Adult learners' },
    pathUas:         'To university of applied sciences',
    pathUni:         'To university',
    videoComing:     'Video coming',
    testLead:        'Is vocational school right for you?',
    testButton:      'Take the 2-min AMISFITS test →',
    faqHeading:      'Frequently asked questions about vocational school',
    institutionsHeading: 'Participating institutions',
    institutionsMore:    'Find all vocational institutions on Studyinfo',
    institutionsMoreUrl: 'https://opintopolku.fi/konfo/en/',
    newTab:          '(opens in a new tab)',
    metaDescription: 'Amis gives you direction – practical experience and working life skills are a real competitive edge. Take the 2-minute Amisfits test.',
    slogan:          'Amis gives you direction',
    themeAlt: {
      1: 'Amis gives you direction. Practical experience and working life skills are a real competitive edge.',
      2: 'Amis opens doors. A vocational qualification provides the same eligibility for further studies as general upper secondary school does.',
      3: 'Amis activates your dreams. Introductory courses, path studies, open UAS and open university studies can help affirm your choice.',
    },
    ogLocale:        'en_GB',
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
    consentTitle:      'Cookies',
    consentText:       'If you accept statistics cookies, we use Google Analytics to improve this website. The data is statistical and is not used for advertising. You can change your choice at any time via the Cookie settings link at the bottom of the page.',
    consentPolicyLink: 'Read the privacy notice',
    consentPolicyUrl:  '/en/privacy/',
    consentAccept:     'Accept statistics cookies',
    consentDeny:       'Necessary only',
    consentSettings:   'Cookie settings',
    privacyLink:       'Privacy notice',
    accessibilityLink: 'Accessibility statement',
    backToFront:       '← Back to the front page',
  },
}

/** Palauttaa käännössanakirjan kielelle (fallback oletuskieleen). */
export function t(lang: Language): Dict {
  return T[lang] ?? T[DEFAULT_LANGUAGE]
}
