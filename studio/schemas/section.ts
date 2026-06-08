import { defineType, defineField } from 'sanity'

// Porttitekstikenttä – käytetään molemmissa audience-varianteissa
const bodyField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type:  'array',
    of:    [{ type: 'block' }],
    description: 'Rikastekstikenttä – tukee lihavoitua, kursiivia ja linkkejä.',
  })

export default defineType({
  name:  'section',
  title: 'Sektio',
  type:  'object',
  fields: [
    defineField({
      name:        'headline',
      title:       'Pääotsikko',
      type:        'string',
      description: 'Iso otsikko, sama molemmille kohderyhmille (esim. "AMIS ANTAA ETUMATKAA")',
      validation:  (R) => R.required(),
    }),

    defineField({
      name:    'backgroundColor',
      title:   'Taustaväri',
      type:    'string',
      options: {
        list: [
          { title: '🌸 Pinkki',    value: 'pink'   },
          { title: '🟡 Keltainen', value: 'yellow' },
          { title: '🔵 Sininen',   value: 'blue'   },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name:        'video',
      title:       'YouTube-video URL',
      type:        'url',
      description: 'Liitä YouTube-videon osoite tähän (valinnainen). Esim. https://www.youtube.com/watch?v=xxxxx',
    }),

    // ── Nuorten sisältö ──────────────────────────────────────────
    {
      name:  'youth',
      title: '👦 Peruskoulunuorten sisältö',
      type:  'object',
      fields: [
        bodyField('summaryYouth',  'Tiivistelmä (aina näkyvissä)'),
        bodyField('expandedYouth', 'Laajennettu teksti (avautuu "Lue lisää" -painikkeesta)'),
      ],
      options: { collapsible: true, collapsed: false },
    },

    // ── Aikuisopiskelijoiden sisältö ─────────────────────────────
    {
      name:  'adult',
      title: '🎓 Aikuisopiskelijoiden sisältö',
      type:  'object',
      fields: [
        bodyField('summaryAdult',  'Tiivistelmä (aina näkyvissä)'),
        bodyField('expandedAdult', 'Laajennettu teksti (avautuu "Lue lisää" -painikkeesta)'),
      ],
      options: { collapsible: true, collapsed: true },
    },
  ],

  preview: {
    select: { title: 'headline', bg: 'backgroundColor' },
    prepare: ({ title, bg }) => ({
      title:    title ?? 'Sektio',
      subtitle: bg === 'pink' ? '🌸 Pinkki' : bg === 'yellow' ? '🟡 Keltainen' : '🔵 Sininen',
    }),
  },
})
