/**
 * seed-fi.mjs — Luo suomenkielinen placeholder-sisältö Sanityyn
 * Aja: node scripts/seed-fi.mjs
 * Vaatii: SANITY_TOKEN ympäristömuuttujan tai kysyy sen
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'l442zg5l',
  dataset:   'production',
  apiVersion: '2024-01-01',
  // Hae token: https://sanity.io/manage → l442zg5l → API → Tokens → Add API token (Editor)
  token: process.env.SANITY_TOKEN,
  useCdn:    false,
})

// ── Portable Text -apufunktio ─────────────────────────────────────────────────
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

// ── Sisältö leiskasta ─────────────────────────────────────────────────────────
// Lisätäytteenä käytetään standardia Lorem Ipsum -tekstiä (julkista, vapaasti
// käytettävää placeholder-latinaa), jotta tekstilohkot vastaavat paremmin
// todellisen sisällön pituutta layoutin testausta varten.
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

const expandedShort = [
  block('Lorem ipsum dolor sit amet', true),
  block('Te velique voluptatium aut maximus sit unt ditas maxim cuptatus dolorum voloruntorio eosa dere etur aut et volectem quam laborate nobis es prae nonsecum et arum volupta vollaccum.'),
  fillerA,
  fillerB,
  fillerC,
  fillerD,
]

const expandedLong = [
  ...expandedShort,
  block('Lorem ipsum', true),
  block('Ut eossum re archillorum eosam voluptatassi derero tet resti dus quatum intus solori delest pressim dempos de pro deligent, comnihi llendist labo.'),
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

// ── Dokumentti ───────────────────────────────────────────────────────────────
const doc = {
  _id:      'onePager-fi',
  _type:    'onePager',
  language: 'fi',

  sections: [
    {
      _type:           'section',
      _key:            'sec-pink',
      displayHeadline: 'ANTAA ETUMATKAA',
      headline:        '',   // SVG-grafiikassa — ei näytetä tekstinä
      backgroundColor: 'pink',
      summaryYouth:    summaryText,
      expandedYouth:   expandedShort,
      summaryAdult:    summaryText,
      expandedAdult:   expandedShort,
    },
    {
      _type:           'section',
      _key:            'sec-yellow',
      displayHeadline: 'avaa ovia',
      headline:        '',   // SVG-grafiikassa — ei näytetä tekstinä
      backgroundColor: 'yellow',
      summaryYouth:    summaryText,
      expandedYouth:   expandedLong,
      summaryAdult:    summaryText,
      expandedAdult:   expandedLong,
    },
    {
      _type:           'section',
      _key:            'sec-blue',
      displayHeadline: 'AKTIVOI UNELMASI',
      headline:        '',   // SVG-grafiikassa — ei näytetä tekstinä
      backgroundColor: 'blue',
      summaryYouth:    summaryText,
      expandedYouth:   expandedLong,
      summaryAdult:    summaryText,
      expandedAdult:   expandedLong,
    },
  ],

  faq: [
    { _key: 'faq1', question: 'Pääseekö amiksesta yliopistoon?',            answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq2', question: 'Mitä voin tehdä valmistumisen jälkeen?',     answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq3', question: 'Onko pakko mennä heti töihin?',              answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq4', question: 'Voinko jatkaa opintoja amiksen jälkeen?',    answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq5', question: 'Miten yhteishaku toimii amikselle?',         answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq6', question: 'Mikä reitti sopii juuri minulle?',           answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq7', question: 'Tarvitsenko lukion käyneitä paremmat paperit?', answerYouth: faqAnswer, answerAdult: faqAnswer },
  ],

  partnerLogos: [],
}

// ── Aja ───────────────────────────────────────────────────────────────────────
async function main() {
  if (!client.config().token) {
    console.error('❌  SANITY_TOKEN puuttuu.')
    console.error('   Hae token: https://sanity.io/manage → l442zg5l → API → Tokens')
    console.error('   Aja: SANITY_TOKEN=xxx node scripts/seed-fi.mjs')
    process.exit(1)
  }

  // createOrReplace ilman drafts.-etuliitettä luo suoraan julkaistun dokumentin
  console.log('⬆️  Luodaan/päivitetään julkaistu onePager-fi...')
  await client.createOrReplace(doc)
  console.log('✅  onePager-fi julkaistu Sanityyn!')
  console.log('   Netlify rakentaa uudelleen automaattisesti (Sanity-webhook).')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
