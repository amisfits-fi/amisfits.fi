/**
 * korjaa-tekstit-2026-10.mjs — Kieli- ja kirjoitusvirheiden korjaukset
 * (sivuston tarkistus 22.10.2026). onePager-fi/-se/-en ja quiz-fi/-se/-en.
 *
 * TURVALLISUUS (sama malli kuin lisaa-tietoiskut-graafi.mjs):
 *   - Oletuksena kuivaharjoitus: tulostaa jokaisen muutoksen, ei muuta mitään.
 *   - Muuttaa vain ne merkkijonot, joissa korjattava teksti on (patch set
 *     _key-poluilla), ei ylikirjoita dokumenttia.
 *   - Tarkka sääntö, jolla on odotettu määrä: jos löytyy eri määrä → seis.
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos dokumentti muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (repon juuresta):
 *   node --env-file=.env scripts/korjaa-tekstit-2026-10.mjs            # kuivaharjoitus
 *   node --env-file=.env scripts/korjaa-tekstit-2026-10.mjs --toteuta  # oikeasti
 */

import { createClient } from '@sanity/client'

const TOTEUTA = process.argv.includes('--toteuta')

// [vanha, uusi, odotettu määrä | null = vähintään yksi]
const DASH  = { re: / - /g, to: ' – ', label: 'väliviiva → ajatusviiva' }
const RANGE = { re: /(\d)-(\d)/g, to: '$1–$2', label: 'numeroväli → ajatusviiva' }

const FIXES = {
  'onePager-fi': [
    ['Ammatillisia perustutkintoja on 42 eri aloilla.', 'Ammatillisia perustutkintoja on 42 eri aloilta.', 1],
    ['ammatillisen perustutkintojen arvosanakorotukset', 'ammatillisten perustutkintojen arvosanakorotukset', null],
    ['erityisammattitutkinto', 'erikoisammattitutkinto', 1],
    ['Tämä tekee opiskelusta mahdollista myös', 'Tämän ansiosta opiskelu on mahdollista myös', 1],
    ['tutustua korkeakouluopintojen ja ammatillisen tutkinnon yhdistämisestä nettisivujen seuraavasta osiosta',
     'tutustua korkeakouluopintojen ja ammatillisen tutkinnon yhdistämiseen sivun seuraavassa osiossa', null],
    ['Korkeakouluopintoihin vaativan erityisen tuen ammatillisesta koulutuksesta',
     'Vaativan erityisen tuen ammatillisesta koulutuksesta korkeakouluopintoihin', 1],
    ['maalis-huhtikuussa', 'maalis–huhtikuussa', null],
    ['väylän kautta, ja hyödyntää', 'väylän kautta ja hyödyntää', null],
    ['myöhemmin hyväksi lukea', 'myöhemmin hyväksilukea', 1],
    ['kaikille avoimia pääasiassa verkossa', 'kaikille avoimia, pääasiassa verkossa', 1],
    DASH,
  ],
  'quiz-fi': [
    ['jossa viihtyy ja', 'jossa viihdyn ja', 1],
    ['Se, että oppii oikeissa', 'Se, että opin oikeissa', 1],
    ['Se, että ymmärtää sekä', 'Se, että ymmärrän sekä', 1],
    ['Se, että saa perehtyä asioihin omaan tahtiin', 'Se, että saan perehtyä asioihin omaan tahtiini', 1],
    ['Ammattiosaamisen Suomenmestaruuskilpailuissa', 'ammattiosaamisen Suomen mestaruuskilpailuissa', null],
    DASH,
  ],
  'onePager-se': [
    ['Suomi Oy Ab', 'Finland Ab', 1],
    // Kurkistuskurssit = prova på-kurser, tutustumiskurssit = introduktionskurser
    ['Introduktionskurser är ett lättillgängligt sätt att bekanta sig med yrkeshögskolestudier',
     'Prova på-kurser är ett lättillgängligt sätt att bekanta sig med yrkeshögskolestudier', 1],
    ['Olika högskolor ordnar introduktionskurser inom olika områden. Att genomföra en introduktionskurs',
     'Olika högskolor ordnar prova på-kurser inom olika områden. Att genomföra en prova på-kurs', 1],
    ['Introduktionskurserna är flexibla och omfattar', 'Prova på-kurserna är flexibla och omfattar', 1],
    DASH,
  ],
  'quiz-se': [
    ['där man trivs', 'där jag trivs', 1],
    DASH,
  ],
  'onePager-en': [
    ['There are 42 different fields on which one can complete a vocational upper secondary qualification.',
     'There are 42 vocational upper secondary qualifications in different fields.', 1],
    ['the first step on your career, higher education or somewhere completely new',
     'the first step towards a career, higher education or a completely new direction', 1],
    ['access a degree student status from university of applied sciences through path studies',
     'gain degree student status at a university of applied sciences through path studies', 1],
    ['first time applicants', 'first-time applicants', null],
    ['Yes you can.', 'Yes, you can.', 1],
    ['Open University studies help', 'Open university studies help', 1],
    ['Helps You Move Forward also as an Adult', 'Helps You Move Forward as an Adult, Too', 1],
    ['(March-April)', '(March–April)', null],
    ['opintopolku.fi/konfo/fi', 'opintopolku.fi/konfo/en', null],
    DASH, RANGE,
  ],
  'quiz-en': [
    ['The main difference from general upper secondary education is that it provides a broad theoretical foundation',
     'The main difference from general upper secondary education is that general upper secondary school provides a broad theoretical foundation', 1],
    DASH, RANGE,
  ],
}

// Regex-sääntöjä ei ajeta osoitteisiin eikä tunnisteisiin
const SKIP_KEYS = new Set(['href', 'url', 'videoUrl', 'videoUrlAdult', 'slug', 'current', 'style', 'listItem'])
const isUrlish = (s) => /^(https?:|mailto:|\/)/.test(s)

function collect(node, segs, rules, out, counts, key) {
  if (typeof node === 'string') {
    let s = node
    rules.forEach((r, i) => {
      if (Array.isArray(r)) {
        const n = s.split(r[0]).length - 1
        if (n) { counts[i] += n; s = s.split(r[0]).join(r[1]) }
      } else if (!SKIP_KEYS.has(key) && !isUrlish(s)) {
        const m = s.match(r.re)
        if (m) { counts[i] += m.length; s = s.replace(r.re, r.to) }
      }
    })
    if (s !== node) out.push({ path: segs.join(''), before: node, after: s })
    return
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      const seg = item && typeof item === 'object' && item._key ? `[_key=="${item._key}"]` : `[${i}]`
      collect(item, [...segs, seg], rules, out, counts, key)
    })
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('_')) continue
      collect(v, [...segs, segs.length ? `.${k}` : k], rules, out, counts, k)
    }
  }
}

function diffSnippet(a, b) {
  let i = 0; while (i < a.length && a[i] === b[i]) i++
  let j = 0; while (j < a.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++
  const pre = Math.max(0, i - 30)
  return `…${a.slice(pre, a.length - j + 30)}…\n      → …${b.slice(pre, b.length - j + 30)}…`
}

// Token .env-tiedostosta, tai Sanity CLI:n kirjautuminen:
//   cd studio && npx sanity exec ../scripts/korjaa-tekstit-2026-10.mjs --with-user-token [-- --toteuta]
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
let client
if (token) {
  client = createClient({ projectId: 'l442zg5l', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false, perspective: 'raw' })
} else {
  const mod = await import('sanity/cli')
  const getCliClient = mod.getCliClient ?? mod.default?.getCliClient
  client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ useCdn: false, perspective: 'raw' })
}

const plan = []
let stop = false
for (const [docId, rules] of Object.entries(FIXES)) {
  const [doc, draft] = await Promise.all([client.getDocument(docId), client.getDocument(`drafts.${docId}`)])
  if (!doc) { console.error(`✖ ${docId}: ei löydy`); stop = true; continue }
  if (draft) { console.error(`✖ ${docId}: Studiossa on julkaisematon luonnos – julkaise tai hylkää se ensin`); stop = true; continue }
  const out = [], counts = rules.map(() => 0)
  collect(doc, [], rules, out, counts, null)
  console.log(`\n══ ${docId} (${out.length} kenttää muuttuu)`)
  rules.forEach((r, i) => {
    const label = Array.isArray(r) ? `"${r[0].slice(0, 50)}"` : r.label
    const exp = Array.isArray(r) ? r[2] : null
    const bad = exp === null ? (Array.isArray(r) && counts[i] === 0) : counts[i] !== exp
    console.log(`  ${bad ? '✖' : '✔'} ${label}: ${counts[i]}${exp !== null ? ` (odotettu ${exp})` : ''}`)
    if (bad) stop = true
  })
  for (const c of out) console.log(`    · ${c.path}\n      ${diffSnippet(c.before, c.after)}`)
  plan.push({ docId, rev: doc._rev, out })
}

if (stop) { console.error('\nSEIS: jokin tarkistus ei täsmännyt. Mitään ei muutettu.'); process.exit(1) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin muutokset tehdään.'); process.exit(0) }

// Yksi transaktio kaikille dokumenteille: kaikki tai ei mitään
const tx = client.transaction()
for (const { docId, rev, out } of plan) {
  if (!out.length) continue
  const set = Object.fromEntries(out.map((c) => [c.path, c.after]))
  tx.patch(docId, (p) => p.ifRevisionId(rev).set(set))
  console.log(`  ${docId}: ${out.length} kenttää`)
}
const res = await tx.commit()
console.log(`✔ Transaktio ${res.transactionId} tehty.`)
console.log('Valmis. Netlify-build lähtee Sanityn webhookista.')
