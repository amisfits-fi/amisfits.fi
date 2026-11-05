/**
 * poista-kumppanilogot-kentta-2026-11.mjs — Kumppanilogot-kenttä (partnerLogos)
 * poistettiin skeemasta 23.10.2026 (a357c7b), mutta sivudokumentteihin jäi
 * siitä tyhjä lista. Studio näyttää sen varoituksena "Unknown field found"
 * jokaisen kielen sisältösivun alaosassa. Skripti poistaa tyhjän kentän.
 * Sivustoon tämä ei vaikuta, koska kenttää ei käytetä missään.
 *
 * TURVALLISUUS (sama malli kuin korjaa-tekstit-2026-10.mjs):
 *   - Oletuksena kuivaharjoitus: näyttää suunnitelman eikä muuta mitään.
 *   - Muuttaa vain partnerLogos-kenttää. Muu sisältö pysyy ennallaan.
 *   - Jos kentässä on logoja, seis (odotettu tilanne on tyhjä lista).
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos sivu muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (Sanity CLI:n kirjautumisella):
 *   cd studio && npx sanity exec ../scripts/poista-kumppanilogot-kentta-2026-11.mjs --with-user-token
 *   cd studio && npx sanity exec ../scripts/poista-kumppanilogot-kentta-2026-11.mjs --with-user-token -- --toteuta
 */

import { createClient } from '@sanity/client'

const TOTEUTA = process.argv.includes('--toteuta')
const DOC_IDS = ['onePager-fi', 'onePager-se', 'onePager-en']
const KENTTA = 'partnerLogos'

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

const suunnitelma = []
let seis = false
for (const id of DOC_IDS) {
  const [doc, draft] = await Promise.all([client.getDocument(id), client.getDocument(`drafts.${id}`)])
  if (!doc) { console.error(`✖ ${id}: dokumenttia ei löydy`); seis = true; continue }
  if (draft) { console.error(`✖ ${id}: Studiossa on julkaisematon luonnos – julkaise tai hylkää se ensin`); seis = true; continue }
  if (!(KENTTA in doc)) { console.log(`  = ${id}: kenttää ei ole, ohitetaan`); continue }
  const arvo = doc[KENTTA]
  if (Array.isArray(arvo) && arvo.length > 0) { console.error(`✖ ${id}: kentässä on ${arvo.length} logoa (odotettu tyhjä)`); seis = true; continue }
  suunnitelma.push({ id, rev: doc._rev })
}
if (seis) { console.error('\nSEIS: jokin tarkistus ei täsmännyt. Mitään ei muutettu.'); process.exit(1) }

console.log(`Poistetaan tyhjä ${KENTTA}-kenttä ${suunnitelma.length} sivulta:`)
for (const s of suunnitelma) console.log(`  − ${s.id}`)
if (!suunnitelma.length) { console.log('\nEi poistettavaa. Mitään ei muutettu.'); process.exit(0) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin kenttä poistetaan.'); process.exit(0) }

let tx = client.transaction()
for (const s of suunnitelma) tx = tx.patch(s.id, (p) => p.ifRevisionId(s.rev).unset([KENTTA]))
const res = await tx.commit()
console.log(`\n✔ Transaktio ${res.transactionId} tehty: kenttä poistettu ${suunnitelma.length} sivulta.`)
