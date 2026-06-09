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
    // ── Koristeellinen näyttöotsikko (valinnainen) ───────────────
    defineField({
      name:        'displayHeadline',
      title:       'Näyttöotsikko',
      type:        'string',
      description: 'Iso koristeellinen teksti ennen sektiota – näkyy valkoisella taustalla (esim. "ANTAA ETUMATKAA", "avaa ovia", "AKTIVOI UNELMASI"). Valinnainen.',
    }),

    defineField({
      name:        'headline',
      title:       'Sisältöotsikko',
      type:        'string',
      description: 'Informatiivinen otsikko värillisen osion sisällä. Jätä tyhjäksi jos otsikko on SVG-grafiikassa.',
    }),

    defineField({
      name:    'backgroundColor',
      title:   'Taustaväri',
      type:    'string',
      options: {
        list: [
          { title: '🌸 Koralli',   value: 'pink'   },
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

    defineField({
      name:        'testCtaUrl',
      title:       'AMISFITS-testi URL',
      type:        'url',
      description: 'Linkki AMISFITS-testiin (näkyy tämän sekstion lopussa). Jätetään tyhjäksi toistaiseksi.',
    }),

    // ── Nuorten sisältö (top-level, ei sisäkkäinen object) ───────
    bodyField('summaryYouth',  '👦 Tiivistelmä – Peruskoulunuoret (aina näkyvissä)'),
    bodyField('expandedYouth', '👦 Laajennettu – Peruskoulunuoret (avautuu "Lue lisää" -painikkeesta)'),

    // ── Aikuisopiskelijoiden sisältö ─────────────────────────────
    bodyField('summaryAdult',  '🎓 Tiivistelmä – Aikuisopiskelijat (aina näkyvissä)'),
    bodyField('expandedAdult', '🎓 Laajennettu – Aikuisopiskelijat (avautuu "Lue lisää" -painikkeesta)'),
  ],

  preview: {
    select: { title: 'headline', display: 'displayHeadline', bg: 'backgroundColor' },
    prepare: ({ title, display, bg }) => ({
      title:    display ? `✨ ${display}` : (title ?? 'Sektio'),
      subtitle: bg === 'pink' ? '🌸 Koralli' : bg === 'yellow' ? '🟡 Keltainen' : '🔵 Sininen',
    }),
  },
})
