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
const summaryText = [
  block('Lorem ipsum dolor', true),
  block('Vent aute simolor emquatur, evelessiti que offici aute doles in pro dolorpo rectia etuscipsam corpores cepedi alignatur?'),
]

const expandedShort = [
  block('Lorem ipsum dolor sit amet', true),
  block('Te velique voluptatium aut maximus sit unt ditas maxim cuptatus dolorum voloruntorio eosa dere etur aut et volectem quam laborate nobis es prae nonsecum et arum volupta vollaccum.'),
]

const expandedLong = [
  ...expandedShort,
  block('Lorem ipsum', true),
  block('Ut eossum re archillorum eosam voluptatassi derero tet resti dus quatum intus solori delest pressim dempos de pro deligent, comnihi llendist labo.'),
]

const faqAnswer = [
  block('Dellatem veni corio cus dolupta sperspicipis erisim quam sitatecum faccab intoreptat remquam dolestiam, velesed moluptia dolupta ssimagnis cor mo idipsum quam sim con rem voluptatem sequi officiet dendaest.'),
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
      headline:        'AMMATILLINEN TUTKINTO ANTAA SAMAN JATKO-OPINTOKELPOISUUDEN KUIN LUKIO.',
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
      headline:        'KURKISTUSKURSSIT, VÄYLÄOPINNOT JA AVOIN AMK TUOVAT VARMUUTTA VALINTAAN.',
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
