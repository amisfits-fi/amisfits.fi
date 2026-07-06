/**
 * seed-quiz-fi.mjs — Luo suomenkielinen Amisfits-testi Sanityyn (quiz-fi)
 * Sisältö: Sari / Sivista, 7/2026 (Amisfits -testi_kysymykset.docx)
 *  - Nuorten kentät = lyhyt "nuorisoversio"
 *  - Aikuisten kentät = pitkä versio
 *
 * Pisteytys (vahvistettu):
 *  - Aikuiset: kaikki kysymykset, vaihtoehdot a/b/c = vihreä, d = keltainen
 *  - Nuoret:   kysymykset 1–4 kuten yllä, viimeisessä (motivaatio) kaikki = vihreä
 *
 * Aja: SANITY_TOKEN=<developer-token> node scripts/seed-quiz-fi.mjs
 * ⚠️ createOrReplace ylikirjoittaa koko quiz-fi-dokumentin — älä aja sen
 *    jälkeen kun sisältöä on muokattu Studiossa.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId:  'l442zg5l',
  dataset:    'production',
  apiVersion: '2024-01-01',
  token:      process.env.SANITY_TOKEN,
  useCdn:     false,
})

// ── Apufunktiot ───────────────────────────────────────────────────────────────
const block = (key, text) => ({
  _type:    'block',
  _key:     key,
  style:    'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
})

/**
 * Kysymys: youth/adult-tekstit + vaihtoehdot.
 * opts: [textYouth, textAdult|null, colorYouth, colorAdult][]
 */
const question = (key, questionYouth, questionAdult, opts) => ({
  _type: 'quizQuestion',
  _key:  key,
  questionYouth,
  ...(questionAdult ? { questionAdult } : {}),
  options: opts.map(([textYouth, textAdult, colorYouth, colorAdult], i) => ({
    _type: 'quizOption',
    _key:  `${key}o${i + 1}`,
    textYouth,
    ...(textAdult ? { textAdult } : {}),
    colorYouth,
    colorAdult,
  })),
})

const G = 'green'
const Y = 'yellow'

// ── Dokumentti ────────────────────────────────────────────────────────────────
const doc = {
  _id:      'quiz-fi',
  _type:    'quiz',
  language: 'fi',

  // Aloitusnäkymä
  titleYouth: 'Testaa, voisiko amis olla sun juttu!',
  leadYouth:  'Tee Amisfits-testi – tähän menee vain pari minuuttia.',
  titleAdult: 'Testaa, voisiko amis olla sinua varten!',
  leadAdult:  'Tee Amisfits-testi, siihen menee vain 2 minuuttia.',

  // Kysymykset — järjestys nuorisoversion mukaan (motivaatio viimeisenä,
  // koska siinä nuorten kaikki vaihtoehdot ovat vihreitä)
  questions: [
    question('q1',
      'Millaisessa opiskelupaikassa viihtyisit?',
      'Tulevassa opiskelupaikassani tahtoisin…',
      [
        ['Haluan tutustua yrityksiin ja työnantajiin jo opintojen aikana', 'Verkostoitua yritysten ja työnantajien kanssa', G, G],
        ['Haluan oppia ratkaisemaan arjen ja työn käytännön juttuja', 'Oppia ratkaisemaan käytännön elämän ongelmia', G, G],
        ['Haluan opiskella itseä kiinnostavaa alaa ja ehkä jatkaa myöhemmin korkeakouluun', 'Opiskella itseä kiinnostavaa alaa, ja ehkä jatkaa korkeakouluun', G, G],
        ['Haluan opiskella monipuolisesti eri aineita', 'Opiskella laajasti erilaisia oppiaineita ja syventyä teorioihin', Y, Y],
      ]),

    question('q2',
      'Millainen tapa oppia tuntuu omalta?',
      'Minkälainen opiskelutyyli tuntuu omalta?',
      [
        ['Oppiminen tekemällä itse', 'Käytännönläheinen oppiminen', G, G],
        ['Oppiminen työpaikalla ja työharjoitteluissa', 'Työpaikoilla oppiminen ja työharjoittelut', G, G],
        ['Sopivasti teoriaa ja käytäntöä', 'Teoreettisen tiedon ja käytännön osaamisen yhdistäminen', G, G],
        ['Lukeminen, kirjoittaminen ja pohdinta', 'Oppikirjojen tai materiaalien lukeminen ja esseiden kirjoittaminen', Y, Y],
      ]),

    question('q3',
      'Mitä toivot tulevalta työelämältä?',
      'Mitä toivot tulevaisuuden työelämältä?',
      [
        ['Haluan tehdä töitä käsillä ja näyttää osaamiseni käytännössä', 'Tahdon tehdä töitä käsilläni ja päästä näyttämään taitoni työelämässä', G, G],
        ['Haluan työn, jossa viihdyn ja joka löytyy sopivalta paikkakunnalta', 'Haluan työn, jossa viihtyy ja joka löytyy sopivalta paikkakunnalta', G, G],
        ['Haluan kehittyä alani osaajaksi ja oppia jatkuvasti lisää', 'Haluan olla alani ammattilainen ja kehittää taitojani jatkuvasti', G, G],
        ['Haluan työn, jossa pääsen analysoimaan asioita', 'Haluan työn, jossa käytän enemmän teoreettista kuin käytännön osaamista', Y, Y],
      ]),

    question('q4',
      'Mitä haluaisit kokea opintojen aikana?',
      'Mitä haluaisit kokea opiskelusi aikana?',
      [
        ['Päästä vaikka ulkomaille töihin tai oppimaan', 'Opiskella ulkomailla', G, G],
        ['Osallistua kisoihin ja näyttää osaamiseni', 'Osallistua kilpailuihin, joissa voin näyttää ammattitaitoni', G, G],
        ['Tutustua eri yritysten toimintaan', 'Tutustua erilaisiin yrityksiin ja niiden toimintaan', G, G],
        ['Lukea, pohtia ja tutkia eri asioita', 'Haluan opiskella itsenäisesti lukemalla ja analysoimalla eri ilmiöitä', Y, Y],
      ]),

    // Nuorilla kaikki vaihtoehdot vihreitä, aikuisilla d = keltainen
    question('q5',
      'Mikä motivoi sinua oppimaan eniten?',
      'Mikä motivoi sinua oppimaan parhaiten?',
      [
        ['Se, että pääsen tekemään itse ja näen konkreettisen lopputuloksen', 'Kun pääsen tekemään itse ja näkemään työn jäljen', G, G],
        ['Se, että oppii oikeissa työtilanteissa muiden mukana', 'Kun opin uutta oikeissa työtilanteissa muiden kanssa', G, G],
        ['Se, että ymmärtää sekä käytännön että teorian', 'Kun ymmärrän sekä käytännön että teorian taustat', G, G],
        ['Se, että saa perehtyä asioihin omaan tahtiin', 'Kun saan syventyä asioihin pohtimalla, lukemalla ja ymmärtämällä', G, Y],
      ]),
  ],

  // Palautetekstit
  results: [
    {
      _type:    'quizResult',
      _key:     'resGreen',
      category: 'green',

      headingYouth: 'Amis voisi sopia sulle tosi hyvin!',
      bodyYouth: [
        block('gy1', 'Ammatillisessa koulutuksessa opit tekemällä ja pääset mukaan oikeaan työelämään jo opintojen aikana. Harjoittelut ja oppisopimus antavat kokemusta ja auttavat löytämään työpaikan.'),
        block('gy2', 'Pääset myös verkostoitumaan työnantajien kanssa ja kokeilemaan erilaisia työtehtäviä. Halutessasi voit jatkaa myöhemmin korkeakouluun – amiksesta on suora väylä sinne.'),
        block('gy3', 'Voit osallistua esimerkiksi Taitaja-kilpailuihin tai lähteä oppimaan ulkomaille.'),
      ],
      sloganYouth: 'Amis voi olla just sun reitti!',

      headingAdult: 'Loistavaa, amis sopii sinulle kuin nenä päähän!',
      bodyAdult: [
        block('ga1', 'Ammatillinen tutkintokoulutus tarjoaa joustavan ja työelämälähtöisen tavan tehdä tutkinto ja kartuttaa omaa osaamista. Oppiminen tapahtuu erilaisissa oppimisympäristöissä oppilaitoksessa ja työpaikoilla koulutus- tai oppisopimuksena. Tiivis yhteistyö työnantajien kanssa varmistaa ajantasaisen osaamisen ja tukee työllistymistä. Pääset verkostoitumaan työnantajien kanssa jo opintojen aikana.'),
        block('ga2', 'Ammatillisesta koulutuksesta on myös suora väylä korkeakouluopintoihin ja ammatillisen tutkinnon suorittaneilla on kelpoisuus hakea jatko-opintoihin ammattikorkeakouluun tai yliopistoon. Kurkistuskurssit, tutustumiskurssit, väyläopinnot ja avoin korkeakoulu tarjoavat monipuolisia mahdollisuuksia tutustua korkeakouluopintoihin jo ammatillisen perustutkinnon aikana.'),
        block('ga3', 'Opintojen aikana sinun on mahdollista testata taitojasi esimerkiksi Ammattiosaamisen Suomenmestaruuskilpailuissa eli Taitaja-kisoissa tai kansainvälisissä opiskelijoiden ammattitaitokilpailuissa. Ja jos kansainvälisyys kiinnostaa erityisesti, voit lähteä opiskelijavaihtoon oppilaitoksen yhteistyöoppilaitokseen tai vaikka osallistua kansainväliseen kehittämishankkeeseen.'),
      ],
      sloganAdult: 'Amis aktivoi unelmasi!',
    },
    {
      _type:    'quizResult',
      _key:     'resYellow',
      category: 'yellow',

      headingYouth: 'Amis voisi olla yksi hyvä vaihtoehto sulle!',
      bodyYouth: [
        block('yy1', 'Ammatillisessa koulutuksessa opiskelu on käytännönläheistä, mutta mukana on myös teoriaa. Saat kokeilla erilaisia juttuja ja oppia työelämässä.'),
        block('yy2', 'Kannattaa miettiä, opitko parhaiten tekemällä vai esimerkiksi lukemalla – se auttaa valinnassa.'),
        block('yy3', 'Amiksesta voit myös hakea jatko-opintoihin ammattikorkeakouluun tai yliopistoon.'),
      ],
      sloganYouth: 'Amis voi avata sulle monia ovia!',

      headingAdult: 'Hienoa, amis saattaa olla sinua varten!',
      bodyAdult: [
        block('ya1', 'Ammatillinen tutkintokoulutus tarjoaa joustavan ja työelämälähtöisen tavan tehdä tutkinto. Opinnot sisältävät teoriaopintoja ja paljon työssäoppimista. Sinun kannattaa punnita, tahdotko oppia enemmän käytännön vai esimerkiksi kirjallisen opiskelun kautta.'),
        block('ya2', 'Ammatillisissa oppilaitoksissa oppiminen tapahtuu erilaisissa oppimisympäristöissä oppilaitoksessa ja työpaikoilla koulutus- tai oppisopimuksena. Tiivis yhteistyö työnantajien kanssa varmistaa ajantasaisen osaamisen ja tukee työllistymistä. Pääset verkostoitumaan työnantajien kanssa jo opintojen aikana.'),
        block('ya3', 'Ammatillisesta koulutuksesta on myös suora väylä korkeakouluopintoihin ja ammatillisen tutkinnon suorittaneilla on kelpoisuus hakea jatko-opintoihin ammattikorkeakouluun tai yliopistoon. Kurkistuskurssit, tutustumiskurssit, väyläopinnot ja avoin korkeakoulu tarjoavat monipuolisia mahdollisuuksia tutustua korkeakouluopintoihin jo ammatillisen perustutkinnon aikana. Suurin ero lukiokoulutukseen on siinä, että lukio antaa hyvän yleissivistävän teoriaperustan ja ammatillinen koulutus keskittyy enemmän ammattiosaamisen taitoihin ja suoraan työllistymiseen.'),
      ],
      sloganAdult: 'Amis avaa ovia!',
    },
  ],

  // CTA — täydennetään kun Sari vahvistaa kohteen (avoin kysymys)
  // ctaLabel: 'Tutustu amikseen',
  // ctaUrl:   'https://opintopolku.fi',
}

// ── Aja ───────────────────────────────────────────────────────────────────────
if (!process.env.SANITY_TOKEN) {
  console.error('❌ Aseta SANITY_TOKEN ympäristömuuttuja (Developer-token, esim. seed-developer)')
  process.exit(1)
}

console.log('Luodaan quiz-fi…')
const res = await client.createOrReplace(doc)
console.log(`✅ Valmis: ${res._id} (rev ${res._rev})`)
