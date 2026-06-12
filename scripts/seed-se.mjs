/**
 * seed-se.mjs — Skapar svenskspråkigt placeholder-innehåll i Sanity
 * Kör: node scripts/seed-se.mjs
 * Kräver: SANITY_TOKEN miljövariabel
 *
 * Obs: brödtexten är Lorem Ipsum (layouttest). Rubriker, knapptexter och
 * FAQ-frågor är översatta. Frontendens UI-text (knappetiketter m.m.) är
 * tills vidare hårdkodad på finska – översätts separat vid i18n.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'l442zg5l',
  dataset:   'production',
  apiVersion: '2024-01-01',
  // Hämta token: https://sanity.io/manage → l442zg5l → API → Tokens → Add API token (Editor)
  token: process.env.SANITY_TOKEN,
  useCdn:    false,
})

// ── Portable Text -hjälpfunktion ──────────────────────────────────────────────
const block = (text, bold = false) => ({
  _type:    'block',
  _key:     Math.random().toString(36).slice(2, 9),
  style:    'normal',
  markDefs: [],
  children: [{
    _type: 'span',
    _key:  Math.random().toString(36).slice(2, 9),
    text,
    marks: bold ? ['strong'] : [],
  }],
})

// ── Innehåll ──────────────────────────────────────────────────────────────────
// Brödtexten använder standard Lorem Ipsum (fri placeholder-latin) så att
// textblocken motsvarar verkligt innehålls längd för layouttest.
const fillerA = block('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')

const fillerB = block('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')

const fillerC = block('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.')

const fillerD = block('Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.')

const fillerE = block('At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.')

const fillerF = block('Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.')

const fillerG = block('Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.')

const summaryText = [
  block('Lorem ipsum dolor', true),
  block('Vent aute simolor emquatur, evelessiti que offici aute doles in pro dolorpo rectia etuscipsam corpores cepedi alignatur?'),
  fillerA,
  fillerB,
  fillerC,
]

// Väg till yrkeshögskola (YH)
const uasText = [
  block('Till yrkeshögskolan', true),
  block('Från yrkesskolan kan du söka direkt till en yrkeshögskola. Den här vägen beskriver hur fortsatta studier vid YH framskrider och vad det kräver.'),
  fillerA,
  fillerB,
  fillerC,
  fillerD,
]

// Väg till universitet (UNI)
const uniText = [
  block('Till universitetet', true),
  block('Även universitetet är en möjlig väg efter yrkesskolan. Här går vi igenom övergångar till universitetet och hur man uppnår högskolebehörighet.'),
  fillerE,
  fillerF,
  fillerG,
]

const faqAnswer = [
  block('Dellatem veni corio cus dolupta sperspicipis erisim quam sitatecum faccab intoreptat remquam dolestiam, velesed moluptia dolupta ssimagnis cor mo idipsum quam sim con rem voluptatem sequi officiet dendaest.'),
  fillerA,
  fillerB,
  fillerC,
  fillerD,
]

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = {
  _id:      'onePager-se',
  _type:    'onePager',
  language: 'se',

  sections: [
    {
      _type:           'section',
      _key:            'sec-pink',
      displayHeadline: 'GER ETT FÖRSPRÅNG',
      headline:        '',   // i SVG-grafiken — visas inte som text
      backgroundColor: 'pink',
      summaryYouth:      summaryText,
      expandedYouth:     uasText,
      expandedYouthUni:  uniText,
      summaryAdult:      summaryText,
      expandedAdult:     uasText,
      expandedAdultUni:  uniText,
    },
    {
      _type:           'section',
      _key:            'sec-yellow',
      displayHeadline: 'öppnar dörrar',
      headline:        '',   // i SVG-grafiken — visas inte som text
      backgroundColor: 'yellow',
      summaryYouth:      summaryText,
      expandedYouth:     uasText,
      expandedYouthUni:  uniText,
      summaryAdult:      summaryText,
      expandedAdult:     uasText,
      expandedAdultUni:  uniText,
    },
    {
      _type:           'section',
      _key:            'sec-blue',
      displayHeadline: 'AKTIVERA DINA DRÖMMAR',
      headline:        '',   // i SVG-grafiken — visas inte som text
      backgroundColor: 'blue',
      summaryYouth:      summaryText,
      expandedYouth:     uasText,
      expandedYouthUni:  uniText,
      summaryAdult:      summaryText,
      expandedAdult:     uasText,
      expandedAdultUni:  uniText,
    },
  ],

  faq: [
    { _key: 'faq1', question: 'Kan man komma in på universitetet från yrkesskolan?',        answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq2', question: 'Vad kan jag göra efter examen?',                              answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq3', question: 'Måste man genast börja jobba?',                               answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq4', question: 'Kan jag fortsätta studera efter yrkesskolan?',                answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq5', question: 'Hur fungerar den gemensamma ansökan till yrkesskolan?',       answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq6', question: 'Vilken väg passar just mig?',                                 answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq7', question: 'Behöver jag bättre papper än de som gått gymnasiet?',         answerYouth: faqAnswer, answerAdult: faqAnswer },
  ],

  partnerLogos: [],
}

// ── Kör ───────────────────────────────────────────────────────────────────────
async function main() {
  if (!client.config().token) {
    console.error('❌  SANITY_TOKEN saknas.')
    console.error('   Hämta token: https://sanity.io/manage → l442zg5l → API → Tokens')
    console.error('   Kör: SANITY_TOKEN=xxx node scripts/seed-se.mjs')
    process.exit(1)
  }

  console.log('⬆️  Skapar/uppdaterar publicerad onePager-se...')
  await client.createOrReplace(doc)
  console.log('✅  onePager-se publicerad i Sanity!')
  console.log('   Netlify bygger om automatiskt (Sanity-webhook).')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
