/**
 * lisaa-tietoiskut-graafi.mjs — Lisää Miian tietolaatikot ja AMK-graafin
 * keltaiseen osioon (onePager-fi).
 *
 * Aineisto: Miia Alvejärvi / Sivista 8.10.2026
 *   - amisfits_graafin_data.xlsx (luvut, Tilastokeskus StatFin)
 *   - amisfits_käännökset.docx   (tekstit fi/sv/en)
 *   - amisfits_elementtien_paikat.pdf (sijoittelu)
 *
 * MITÄ TEKEE (vain onePager-fi, keltainen osio):
 *   Nuoret, tiivistelmä:  "Tiesitkö?" väliotsikon "Yleinen jatko-opintokelpoisuus" alle
 *   Nuoret + aikuiset, AMK-polku:
 *     - AMK_2.png-kuva korvataan pylväskaaviolla (sama paikka)
 *     - "Huomio!" todistusvalinnan 3. kappaleen yläpuolelle
 *     - poistetaan kappale "Huomioi, että todistusvalinnan kriteerit…",
 *       koska sama asia on nyt Huomio!-laatikossa (ohita: --ei-poistoja)
 *   Aikuisille EI tule Tiesitkö?-laatikkoa (Miian toive).
 *
 * TURVALLISUUS:
 *   - Oletuksena kuivaharjoitus: näyttää mitä tekisi, ei muuta mitään.
 *   - Ei ylikirjoita dokumenttia: tekee vain kohdistetut lisäykset/poistot
 *     _key-tunnisteilla, ja tarkistaa ensin että jokainen kohde on yhä
 *     paikallaan ja sisältää odotetun tekstin. Jos jokin on muuttunut → seis.
 *   - Jos Studiossa on julkaisematon luonnos → seis (muuten luonnoksen
 *     julkaisu pyyhkisi nämä muutokset pois).
 *   - Ajon voi toistaa: jo lisätyt elementit ohitetaan.
 *   - Kaikki on peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (repon juuresta, token luetaan .env-tiedostosta):
 *   node --env-file=.env scripts/lisaa-tietoiskut-graafi.mjs            # kuivaharjoitus
 *   node --env-file=.env scripts/lisaa-tietoiskut-graafi.mjs --toteuta  # oikeasti
 *
 * Julkaistuun dokumenttiin tehty muutos laukaisee Netlify-buildin webhookin kautta.
 */

import { createClient } from '@sanity/client'
import { pathToFileURL } from 'node:url'

// ── Sisältö kolmella kielellä ────────────────────────────────────────────────

// Luvut: Tilastokeskus StatFin, uudet AMK-opiskelijat 2024 aiemman tutkinnon mukaan
const VALUES = [14682, 14401, 4618, 2674, 1172, 574, 395, 5520]
const HIGHLIGHT = [false, true, true, false, false, false, false, false]

const TEXT = {
  fi: {
    tiesitko: 'Tiesitkö?',
    tiesitkoBody: 'Monissa ammatillisissa oppilaitoksissa voi suorittaa kaksoistutkinnon, jolloin valmistut sekä ammattiin että ylioppilaaksi. Myös kumpi tahansa koulutus yksinään antaa yleisen jatko-opintokelpoisuuden, eli mahdollisuuden hakea opiskelemaan yliopistoon tai ammattikorkeakouluun.',
    huomio: 'Huomio!',
    huomioBody: 'Todistusvalinnan kriteerit voivat vaihdella koulutuksittain ja vuosittain. Tarkasta aina ajankohtaisin tieto esimerkiksi ammattikorkeakouluun.fi-sivulta tai ammattikorkeakoulujen kotisivuilta!',
    chartTitle: 'AMK-tutkinnon aloittaneet aikaisemman korkeimman tutkinnon mukaan, 2024',
    rows: [
      'Ylioppilastutkinto',
      'Toisen asteen ammatillinen tutkinto',
      'Ylioppilastutkinto ja toisen asteen ammatillinen tutkinto',
      'Ammattikorkeakoulututkinto',
      'Ylempi korkeakoulututkinto tai tutkijakoulutus',
      'Alempi korkeakoulututkinto yliopistosta',
      'Opistoasteen tai ammatillisen korkea-asteen tutkinto',
      'Aikaisempi koulutus tuntematon tai peruskoulu',
    ],
    notes: { 1: '32,7 % kaikista uusista AMK-opiskelijoista', 2: '10,5 % kaikista uusista AMK-opiskelijoista' },
    source: 'Lähde: Tilastokeskus, Koulutukseen hakeutuminen',
    caption: 'Tilastokeskuksen StatFin-tietokannan mukaan vuonna 2024 ammattikorkeakouluopinnot aloittaneista uusista opiskelijoista 32,7 prosentilla korkein suoritettu tutkinto oli toisen asteen ammatillinen tutkinto ja 10,5 prosentilla toisen asteen ammatillinen tutkinto ja ylioppilastutkinto.',
  },
  se: {
    tiesitko: 'Visste du?',
    tiesitkoBody: 'På många yrkesläroanstalter kan du avlägga en kombinationsexamen, vilket innebär att du både utbildar dig till ett yrke och blir student. Båda utbildningarna ger också var för sig allmän behörighet för fortsatta studier, det vill säga möjlighet att söka till universitet eller yrkeshögskola.',
    huomio: 'Observera!',
    huomioBody: 'Kriterierna för betygsantagningen kan variera mellan olika utbildningar och från år till år. Kontrollera alltid den aktuella informationen till exempel på ammattikorkeakouluun.fi eller på yrkeshögskolornas egna webbplatser!',
    chartTitle: 'Studerande som inlett yrkeshögskoleexamen efter tidigare högsta examen, 2024',
    rows: [
      'Studentexamen',
      'Yrkesexamen på andra stadiet',
      'Studentexamen och yrkesexamen på andra stadiet',
      'Yrkeshögskoleexamen',
      'Högre högskoleexamen eller forskarutbildning',
      'Lägre högskoleexamen från universitet',
      'Examen på institutnivå eller yrkesexamen på högre nivå',
      'Tidigare utbildning okänd eller grundskola',
    ],
    notes: { 1: '32,7 % av alla nya YH-studerande', 2: '10,5 % av alla nya YH-studerande' },
    source: 'Källa: Statistikcentralen, Sökande till utbildning',
    caption: 'Enligt Statistikcentralens StatFin-databas hade 32,7 procent av de nya studerande som inledde sina yrkeshögskolestudier år 2024 en yrkesinriktad examen på andra stadiet som sin högsta tidigare avlagda examen och 10,5 procent hade en yrkesexamen på andra stadiet och en studentexamen.',
  },
  en: {
    tiesitko: 'Did you know?',
    tiesitkoBody: 'At many vocational institutions, you can complete a dual qualification, which means qualifying for a profession while also completing the Finnish matriculation examination. Completing either qualification on its own also gives you general eligibility for further studies, meaning that you can apply to a university or a University of Applied Sciences.',
    huomio: 'Attention!',
    huomioBody: 'The criteria for admission based on certificates may change between programmes and from year to year. Always check the latest information, for example on ammattikorkeakouluun.fi or on the websites of the Universities of Applied Sciences!',
    chartTitle: 'New entrants to Universities of Applied Sciences (UAS) by prior highest qualification, 2024',
    rows: [
      'Matriculation examination',
      'Upper secondary vocational qualification',
      'Matriculation examination and upper secondary vocational qualification',
      'University of Applied Sciences degree',
      'Higher university degree or doctoral or equivalent degree',
      "University education, Bachelor's degree",
      'Vocational post-secondary or tertiary level qualification',
      'Previous qualification unknown or comprehensive school',
    ],
    notes: { 1: '32.7% of all new UAS students', 2: '10.5% of all new UAS students' },
    source: 'Source: Statistics Finland, Entrance to education',
    caption: "According to Statistics Finland's StatFin database, among the new students who began studies at a University of Applied Sciences in 2024, 32.7 per cent had a vocational qualification at upper secondary level as their highest completed qualification, while 10.5 per cent had both a vocational qualification at upper secondary level and a matriculation examination.",
  },
}

const block = (key, text) => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
})

export function content(lang) {
  const t = TEXT[lang]
  return {
    tiesitko: {
      _type: 'infoBox', _key: 'ib-tiesitko',
      title: t.tiesitko, body: [block('ibt1', t.tiesitkoBody)],
      placement: 'right', tilted: true,
    },
    huomio: {
      _type: 'infoBox', _key: 'ib-huomio',
      title: t.huomio, body: [block('ibh1', t.huomioBody)],
      placement: 'right', tilted: true,
    },
    chart: {
      _type: 'barChart', _key: 'chart-amk-2024',
      title: t.chartTitle,
      rows: t.rows.map((label, i) => ({
        _type: 'barChartRow', _key: `r${i + 1}`,
        label, value: VALUES[i], highlight: HIGHLIGHT[i],
        ...(t.notes[i] ? { note: t.notes[i] } : {}),
      })),
      source: t.source,
      caption: t.caption,
    },
  }
}

// ── Toimenpiteet (vain fi – sv/en-sivuilla on vielä lorem-täytettä) ─────────
// Jokainen kohde tunnistetaan Sanityn _key-tunnisteella ja varmistetaan
// tekstin alulla. Avaimet luettu julkaistusta onePager-fi:stä 9.10.2026.
//   op: 'after' | 'before' | 'replace' | 'unset'
//   expect: { type?, text? } – kohteen on vastattava tätä, muuten seis
const PLAN = {
  fi: [
    { field: 'summaryYouth',  op: 'after',   key: 'l9n3xqv',      expect: { text: 'Yleinen jatko-opintokelpoisuus' },   item: 'tiesitko', what: 'Tiesitkö? → "Yleinen jatko-opintokelpoisuus" -otsikon alle' },
    { field: 'expandedYouth', op: 'replace', key: '3e92b8439bf3', expect: { type: 'image' },                            item: 'chart',    what: 'AMK_2.png-kuva → pylväskaavio' },
    { field: 'expandedYouth', op: 'before',  key: 'db4bf3beb18c', expect: { text: 'Jos olet suorittanut sekä' },        item: 'huomio',   what: 'Huomio! → todistusvalinnan 3. kappaleen yläpuolelle' },
    { field: 'expandedYouth', op: 'unset',   key: '3987e0bc000e', expect: { text: 'Huomioi, että todistusvalinnan' },   removal: true, what: 'poista kappale "Huomioi, että todistusvalinnan kriteerit…" (sama asia laatikossa)' },
    { field: 'expandedAdult', op: 'replace', key: 'ff8dd4de2cf6', expect: { type: 'image' },                            item: 'chart',    what: 'AMK_2.png-kuva → pylväskaavio' },
    { field: 'expandedAdult', op: 'before',  key: '4fc030c5664d', expect: { text: 'Jos olet suorittanut sekä' },        item: 'huomio',   what: 'Huomio! → todistusvalinnan 3. kappaleen yläpuolelle' },
    { field: 'expandedAdult', op: 'unset',   key: 'f624197d4af5', expect: { text: 'Huomioi, että todistusvalinnan' },   removal: true, what: 'poista kappale "Huomioi, että todistusvalinnan kriteerit…" (sama asia laatikossa)' },
  ],
}

// ── Ajo ──────────────────────────────────────────────────────────────────────

const plainText = (b) => (b?.children ?? []).map((c) => c.text ?? '').join('')

/**
 * Laskee tehtävät muutokset koskematta Sanityyn.
 * Palauttaa { section, lines, specs, errors } – specs = [{ op, path, items? }]
 */
export function plan(doc, { lang = 'fi', keepText = false } = {}) {
  const lines = []
  const specs = []
  let errors  = 0

  const section = (doc.sections ?? []).find((s) => s.backgroundColor === 'yellow')
  if (!section) return { section: null, lines: ['  ✖  Keltaista osiota ei löydy.'], specs, errors: 1 }

  const items = content(lang)
  const base  = `sections[_key=="${section._key}"]`

  for (const step of PLAN[lang]) {
    const arr    = section[step.field] ?? []
    const target = arr.find((b) => b._key === step.key)
    const label  = `${step.field.padEnd(14)} ${step.what}`

    if (step.removal && keepText) { lines.push(`  –  ohitettu (--ei-poistoja): ${label}`); continue }

    // Jo tehty? (elementti olemassa tai poistettava kohde jo poissa)
    const itemKey = step.item ? items[step.item]._key : null
    if (itemKey && arr.some((b) => b._key === itemKey)) {
      lines.push(`  ✓  jo tehty: ${label}${target && step.op === 'replace' ? ' (HUOM: vanha kuva on yhä paikallaan – poista se Studiossa)' : ''}`)
      continue
    }
    if (step.op === 'unset' && !target) { lines.push(`  ✓  jo tehty: ${label}`); continue }

    // Kohteen tarkistus
    if (!target) { lines.push(`  ✖  KOHDE PUUTTUU (${step.key}): ${label}`); errors++; continue }
    if (step.expect.type && target._type !== step.expect.type) {
      lines.push(`  ✖  KOHDE ON MUUTTUNUT (odotettiin ${step.expect.type}, löytyi ${target._type}): ${label}`); errors++; continue
    }
    if (step.expect.text && !plainText(target).startsWith(step.expect.text)) {
      lines.push(`  ✖  KOHTEEN TEKSTI ON MUUTTUNUT ("${plainText(target).slice(0, 40)}…"): ${label}`); errors++; continue
    }

    const path = `${base}.${step.field}[_key=="${step.key}"]`
    specs.push(step.op === 'unset' ? { op: 'unset', path } : { op: step.op, path, items: [items[step.item]] })
    lines.push(`  +  ${label}`)
  }
  return { section, lines, specs, errors }
}

/**
 * Rakentaa transaktion: jokainen muutos omana mutaationaan (kaikki tai ei mitään).
 * Yksi patch-olio ei kelpaa, koska useampi insert samassa patchissa
 * yhdistyisi ja vain viimeinen jäisi voimaan.
 */
export function buildTransaction(client, docId, rev, specs) {
  const tx = client.transaction()
  specs.forEach((m, i) => tx.patch(docId, (p) => {
    const q = i === 0 ? p.ifRevisionId(rev) : p
    return m.op === 'unset' ? q.unset([m.path]) : q.insert(m.op, m.path, m.items)
  }))
  return tx
}

async function main() {
  const args     = process.argv.slice(2)
  const execute  = args.includes('--toteuta')
  const keepText = args.includes('--ei-poistoja')
  const lang     = 'fi'
  const docId    = `onePager-${lang}`

  const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
  if (!token) {
    console.error('✖ Token puuttuu. Aja repon juuresta: node --env-file=.env scripts/lisaa-tietoiskut-graafi.mjs')
    process.exit(1)
  }

  const client = createClient({
    projectId: 'l442zg5l', dataset: 'production', apiVersion: '2024-01-01',
    token, useCdn: false, perspective: 'raw',
  })

  const [doc, draft] = await Promise.all([
    client.getDocument(docId),
    client.getDocument(`drafts.${docId}`),
  ])
  if (!doc) { console.error(`✖ Dokumenttia ${docId} ei löydy.`); process.exit(1) }
  if (draft) {
    console.error(`✖ ${docId}:lla on Studiossa julkaisematon luonnos (muokattu ${draft._updatedAt}).`)
    console.error('  Julkaise tai hylkää luonnos ensin, muuten sen julkaisu pyyhkisi nämä muutokset.')
    process.exit(1)
  }

  const { section, lines, specs, errors } = plan(doc, { lang, keepText })
  console.log(`\n${docId} · keltainen osio (${section?._key ?? '?'}) · revisio ${doc._rev}\n`)
  console.log(lines.join('\n') + '\n')

  if (errors) {
    console.error(`✖ ${errors} kohdetta ei täsmää – mitään ei muutettu. Sisältöä on muokattu ${doc._updatedAt}; tarkista kohteet.`)
    process.exit(1)
  }
  if (!specs.length) { console.log('Ei tehtävää – kaikki on jo paikallaan.'); return }
  if (!execute) {
    console.log(`Kuivaharjoitus: ${specs.length} muutosta odottaa. Aja uudelleen lisäämällä --toteuta`)
    return
  }

  const res = await buildTransaction(client, docId, doc._rev, specs).commit()
  console.log(`✔ Tehty ${specs.length} muutosta (transaktio ${res.transactionId}). Netlify-build lähtee webhookista.`)
  console.log('  Peruminen tarvittaessa: Studio → dokumentti → History → valitse edellinen versio → Revert → Publish.')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((err) => {
    console.error('✖ Virhe:', err.message)
    if (/permission|unauthor|401|403/i.test(err.message)) {
      console.error('  Token ei kelpaa kirjoittamiseen. Luo Editor-tason token: sanity.io/manage → amisfits → API → Tokens, ja päivitä se .env-tiedoston SANITY_API_TOKEN-riville.')
    }
    process.exit(1)
  })
}
