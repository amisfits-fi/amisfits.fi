import { defineType, defineField, defineArrayMember } from 'sanity'

// ── Mukana olevat oppilaitokset ──────────────────────────────────────────────
// Yksi yhteinen lista kaikille kielille ja molemmille kohderyhmille (päätetty
// Sarin kanssa 23.10.2026). Näkyy sivun alaosassa ennen alatunnistetta:
// nimet aakkosjärjestyksessä, kukin linkkinä oppilaitoksen kotisivulle.
// Sivu järjestää nimet itse, joten järjestyksellä täällä ei ole väliä.
//
// Miksi yksi dokumentti eikä dokumentti per oppilaitos: jokainen julkaisu
// käynnistää Netlify-buildin (15 krediittiä). Koko listan voi lisätä tai
// päivittää yhdellä julkaisulla.

function hostname(url?: string): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const urlRule = (R: any) => R.uri({ scheme: ['https', 'http'] })

export default defineType({
  name:  'institutionList',
  title: 'Oppilaitokset',
  type:  'document',
  // Yksi dokumentti, joka avataan Studion valikosta (documentId: institutionList).
  // create tarvitaan, jotta dokumentin voi luoda ensimmäisellä tallennuksella;
  // "Luo uusi" -valikosta tyyppi on piilotettu sanity.config.ts:ssä.
  // delete puuttuu tarkoituksella: listaa ei voi poistaa vahingossa.
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    defineField({
      name:        'institutions',
      title:       'Oppilaitokset',
      type:        'array',
      description: 'Näkyvät sivun alaosassa kaikilla kielillä. Sivu järjestää nimet aakkosjärjestykseen, joten järjestyksellä täällä ei ole väliä. Kun lista on tyhjä, osio ei näy sivulla.',
      of: [
        defineArrayMember({
          name:  'institution',
          title: 'Oppilaitos',
          type:  'object',
          fields: [
            defineField({
              name:       'name',
              title:      'Nimi',
              type:       'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name:        'nameSv',
              title:       'Nimi ruotsiksi',
              type:        'string',
              description: 'Jos oppilaitoksella on ruotsinkielinen nimi. Tyhjänä ruotsinkielisellä sivulla näkyy suomenkielinen nimi.',
            }),
            defineField({
              name:        'url',
              title:       'Kotisivu',
              type:        'url',
              description: 'Koko osoite, esim. https://www.oppilaitos.fi',
              validation:  (R) => urlRule(R).required(),
            }),
            defineField({
              name:        'urlSv',
              title:       'Kotisivu ruotsiksi',
              type:        'url',
              description: 'Jos oppilaitoksella on ruotsinkielinen sivu. Tyhjänä käytetään suomenkielistä kotisivua.',
              validation:  urlRule,
            }),
            defineField({
              name:        'urlEn',
              title:       'Kotisivu englanniksi',
              type:        'url',
              description: 'Jos oppilaitoksella on englanninkielinen sivu. Tyhjänä käytetään suomenkielistä kotisivua.',
              validation:  urlRule,
            }),
          ],
          preview: {
            select:  { title: 'name', nameSv: 'nameSv', url: 'url' },
            prepare: ({ title, nameSv, url }) => ({
              title:    title || 'Nimetön oppilaitos',
              subtitle: [nameSv, hostname(url)].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
  ],

  preview: {
    select:  { institutions: 'institutions' },
    prepare: ({ institutions }) => ({
      title:    'Oppilaitokset',
      subtitle: `${Array.isArray(institutions) ? institutions.length : 0} oppilaitosta`,
    }),
  },
})
