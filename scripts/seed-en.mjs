/**
 * seed-en.mjs — Creates English placeholder content in Sanity
 * Run: node scripts/seed-en.mjs
 * Requires: SANITY_TOKEN environment variable
 *
 * Note: body text is Lorem Ipsum (layout testing). Headlines, button leads and
 * FAQ questions are translated. The frontend UI text (button labels etc.) is
 * still hardcoded in Finnish – to be translated separately when i18n is added.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'l442zg5l',
  dataset:   'production',
  apiVersion: '2024-01-01',
  // Get a token: https://sanity.io/manage → l442zg5l → API → Tokens → Add API token (Editor)
  token: process.env.SANITY_TOKEN,
  useCdn:    false,
})

// ── Portable Text helper ──────────────────────────────────────────────────────
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

// ── Content ───────────────────────────────────────────────────────────────────
// Body text uses standard Lorem Ipsum (free placeholder Latin) so the text
// blocks better match the length of real content for layout testing.
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

// Path to a university of applied sciences (UAS)
const uasText = [
  block('To a university of applied sciences', true),
  block('From vocational school you can apply directly to a university of applied sciences. This path explains how further studies at a UAS work and what they require.'),
  fillerA,
  fillerB,
  fillerC,
  fillerD,
]

// Path to university (UNI)
const uniText = [
  block('To university', true),
  block('University is also a possible route after vocational school. Here we cover transitions to university and how to achieve eligibility for higher education.'),
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

// ── Document ──────────────────────────────────────────────────────────────────
const doc = {
  _id:      'onePager-en',
  _type:    'onePager',
  language: 'en',

  sections: [
    {
      _type:           'section',
      _key:            'sec-pink',
      displayHeadline: 'GIVES A HEAD START',
      headline:        '',   // in the SVG graphic — not shown as text
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
      displayHeadline: 'opens doors',
      headline:        '',   // in the SVG graphic — not shown as text
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
      displayHeadline: 'ACTIVATE YOUR DREAMS',
      headline:        '',   // in the SVG graphic — not shown as text
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
    { _key: 'faq1', question: 'Can you get into university from vocational school?',              answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq2', question: 'What can I do after graduation?',                                  answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq3', question: 'Do I have to start working right away?',                           answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq4', question: 'Can I continue studying after vocational school?',                 answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq5', question: 'How does the joint application to vocational school work?',        answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq6', question: 'Which path suits me best?',                                        answerYouth: faqAnswer, answerAdult: faqAnswer },
    { _key: 'faq7', question: 'Do I need better grades than those who went to upper secondary?',  answerYouth: faqAnswer, answerAdult: faqAnswer },
  ],

  partnerLogos: [],
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  if (!client.config().token) {
    console.error('❌  SANITY_TOKEN is missing.')
    console.error('   Get a token: https://sanity.io/manage → l442zg5l → API → Tokens')
    console.error('   Run: SANITY_TOKEN=xxx node scripts/seed-en.mjs')
    process.exit(1)
  }

  console.log('⬆️  Creating/updating published onePager-en...')
  await client.createOrReplace(doc)
  console.log('✅  onePager-en published to Sanity!')
  console.log('   Netlify will rebuild automatically (Sanity webhook).')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
