import { defineType, defineField, defineArrayMember } from 'sanity'

// ── Vaakapylväskaavio ────────────────────────────────────────────────────────
// Rakennetaan sivulle oikeana tekstinä (ei kuvana), jotta se on luettava
// puhelimessa, toimii kaikilla kielillä ja luvut voi päivittää itse.
// Palkkien pituudet lasketaan automaattisesti suurimmasta luvusta.

export default defineType({
  name:  'barChart',
  title: 'Pylväskaavio',
  type:  'object',
  fields: [
    defineField({
      name:       'title',
      title:      'Otsikko',
      type:       'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name:        'rows',
      title:       'Rivit',
      type:        'array',
      description: 'Yksi rivi = yksi palkki. Järjestys sivulla on sama kuin tässä – vedä riviä kahvasta siirtääksesi.',
      of: [
        defineArrayMember({
          type:  'object',
          name:  'barChartRow',
          title: 'Rivi',
          fields: [
            defineField({
              name:       'label',
              title:      'Selite',
              type:       'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name:        'value',
              title:       'Luku',
              type:        'number',
              description: 'Kirjoita pelkkä luku ilman välilyöntejä, esim. 14682. Desimaalit pisteellä, esim. 33.3',
              validation:  (R) => R.required().min(0),
            }),
            defineField({
              name:         'highlight',
              title:        'Korosta (sininen palkki)',
              type:         'boolean',
              initialValue: false,
            }),
            defineField({
              name:        'note',
              title:       'Huomautus palkin alla (valinnainen)',
              type:        'string',
              description: 'Esim. "33,3 % kaikista uusista AMK-opiskelijoista"',
            }),
          ],
          preview: {
            select:  { label: 'label', value: 'value', hl: 'highlight', note: 'note' },
            prepare: ({ label, value, hl, note }) => ({
              title:    `${hl ? '🔵' : '🟥'} ${label ?? ''}`,
              subtitle: [value, note].filter((v) => v !== undefined && v !== null && v !== '').join(' · '),
            }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name:        'unit',
      title:       'Yksikkö (valinnainen)',
      type:        'string',
      description: 'Näytetään lukujen perässä, esim. "%". Jätä tyhjäksi, jos luvut ovat kappalemääriä.',
    }),
    defineField({
      name:        'source',
      title:       'Lähde',
      type:        'string',
      description: 'Esim. "Lähde: Tilastokeskus, Koulutukseen hakeutuminen"',
    }),
    defineField({
      name:        'caption',
      title:       'Kuvateksti',
      type:        'text',
      rows:        3,
      description: 'Näkyy kaavion alla ja on samalla kaavion kuvaus ruudunlukijaa käyttäville. Kerro lyhyesti, mitä kaavio näyttää.',
    }),
  ],
  preview: {
    select:  { title: 'title', rows: 'rows' },
    prepare: ({ title, rows }) => ({
      title:    `📊 ${title || 'Pylväskaavio'}`,
      subtitle: `Pylväskaavio · ${Array.isArray(rows) ? rows.length : 0} riviä`,
    }),
  },
})
