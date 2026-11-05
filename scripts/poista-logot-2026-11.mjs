/**
 * poista-logot-2026-11.mjs — Logoruudukon kokeilu päättyi 5.11.2026: Sivista
 * valitsi nimilistan. Skripti poistaa logot oppilaitoslistasta, koska
 * logokenttä poistuu Studiosta. Muuten Studio varoittaisi tuntemattomasta
 * kentästä, kun oppilaitosta muokataan.
 *
 * TURVALLISUUS (sama malli kuin korjaa-tekstit-2026-10.mjs):
 *   - Oletuksena kuivaharjoitus: näyttää, keiltä logo poistettaisiin, eikä
 *     muuta mitään.
 *   - Muuttaa vain logokenttiä. Nimet ja linkit pysyvät ennallaan.
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos lista muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *   - Kuvatiedostot jäävät Sanityn mediakirjastoon. Alkuperäiset logot ovat
 *     projektikansiossa: ETEKAn 1. sovelluskatselmointi/oppilaitosten_logot/
 *
 * JÄRJESTYS: aja tämä ennen kuin Studio julkaistaan uudelleen (npx sanity deploy).
 *
 * AJO (Sanity CLI:n kirjautumisella):
 *   cd studio && npx sanity exec ../scripts/poista-logot-2026-11.mjs --with-user-token
 *   cd studio && npx sanity exec ../scripts/poista-logot-2026-11.mjs --with-user-token -- --toteuta
 */

import { createClient } from '@sanity/client'

const TOTEUTA = process.argv.includes('--toteuta')
const DOC_ID = 'institutionList'

// Token .env-tiedostosta, tai Sanity CLI:n kirjautuminen (ks. AJO yllä)
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
let client
if (token) {
  client = createClient({ projectId: 'l442zg5l', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false, perspective: 'raw' })
} else {
  const mod = await import('sanity/cli')
  const getCliClient = mod.getCliClient ?? mod.default?.getCliClient
  client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ useCdn: false, perspective: 'raw' })
}

const [doc, draft] = await Promise.all([client.getDocument(DOC_ID), client.getDocument(`drafts.${DOC_ID}`)])
if (draft) {
  console.error('✖ Studiossa on julkaisematon luonnos oppilaitoslistasta – julkaise tai hylkää se ensin. Mitään ei muutettu.')
  process.exit(1)
}
if (!doc) { console.error('✖ Oppilaitoslistaa ei löydy. Mitään ei muutettu.'); process.exit(1) }

// Myös tyhjä logo-objekti poistetaan, koska sekin näkyisi Studiossa tuntemattomana kenttänä
const logolliset = (doc.institutions ?? []).filter((o) => o && typeof o === 'object' && 'logo' in o)
if (logolliset.some((o) => !o._key)) {
  console.error('✖ Jollakin oppilaitoksella ei ole _key-tunnistetta. Mitään ei muutettu.')
  process.exit(1)
}

console.log(`Poistetaan logo ${logolliset.length} oppilaitokselta:`)
for (const o of logolliset) console.log(`  − ${o.name || '(nimetön)'}`)
if (!logolliset.length) { console.log('\nEi poistettavaa. Mitään ei muutettu.'); process.exit(0) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin logot poistetaan listasta.'); process.exit(0) }

const polut = logolliset.map((o) => `institutions[_key=="${o._key}"].logo`)
const res = await client.transaction().patch(DOC_ID, (p) => p.ifRevisionId(doc._rev).unset(polut)).commit()
console.log(`\n✔ Transaktio ${res.transactionId} tehty: logo poistettu ${logolliset.length} oppilaitokselta.`)
console.log('Seuraavaksi studio-kansiossa: npx sanity deploy (logokenttä poistuu Studiosta).')
