import { defineType, defineField } from 'sanity'

// ── Rikastekstikenttä – tukee lihavointia, kursiivia, linkkejä,
//    sekä tekstin sisään upotettavia KUVIA ja TIEDOSTOLIITTEITÄ ───────────────
const bodyField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type:  'array',
    of: [
      { type: 'block' },
      // Kuva tekstin sisään
      {
        type:    'image',
        options: { hotspot: true },
        fields:  [
          defineField({
            name:  'alt',
            title: 'Vaihtoehtoinen teksti (saavutettavuus)',
            type:  'string',
          }),
        ],
      },
      // Tiedostoliite (PDF tms.) tekstin sisään
      {
        type:   'object',
        name:   'fileAttachment',
        title:  'Tiedostoliite',
        fields: [
          defineField({ name: 'file',  title: 'Tiedosto',      type: 'file'   }),
          defineField({ name: 'title', title: 'Linkin teksti', type: 'string' }),
        ],
        preview: {
          select:  { title: 'title', fname: 'file.asset.originalFilename' },
          prepare: ({ title, fname }) => ({ title: title || fname || '📎 Tiedosto' }),
        },
      },
    ],
    description: 'Rikastekstikenttä – tukee lihavointia, kursiivia, linkkejä, kuvia ja tiedostoliitteitä.',
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
      description: 'Linkki AMISFITS-testiin (näkyy tämän sektion lopussa). Jätetään tyhjäksi toistaiseksi.',
    }),

    // ── Nuorten sisältö ──────────────────────────────────────────
    bodyField('summaryYouth',     '👦 Tiivistelmä – Peruskoulunuoret (aina näkyvissä)'),
    bodyField('expandedYouth',    '👦 Polku ammattikorkeakouluun – Peruskoulunuoret (painike "Ammattikorkeakouluun")'),
    bodyField('expandedYouthUni', '👦 Polku yliopistoon – Peruskoulunuoret (painike "Yliopistoon")'),

    // ── Aikuisopiskelijoiden sisältö ─────────────────────────────
    bodyField('summaryAdult',     '🎓 Tiivistelmä – Aikuisopiskelijat (aina näkyvissä)'),
    bodyField('expandedAdult',    '🎓 Polku ammattikorkeakouluun – Aikuisopiskelijat (painike "Ammattikorkeakouluun")'),
    bodyField('expandedAdultUni', '🎓 Polku yliopistoon – Aikuisopiskelijat (painike "Yliopistoon")'),

    // ── Erilliset kuva- ja tiedostokentät (näkyvät osion lopussa) ─
    defineField({
      name:    'images',
      title:   'Kuvat (osion lopussa)',
      type:    'array',
      of: [{
        type:    'image',
        options: { hotspot: true },
        fields:  [
          defineField({
            name:  'alt',
            title: 'Vaihtoehtoinen teksti (saavutettavuus)',
            type:  'string',
          }),
        ],
      }],
      description: 'Kuvat näytetään osion lopussa, ennen testipainiketta.',
    }),

    defineField({
      name:    'attachments',
      title:   'Tiedostoliitteet (osion lopussa)',
      type:    'array',
      of: [{
        type:   'object',
        name:   'attachment',
        title:  'Tiedosto',
        fields: [
          defineField({ name: 'title', title: 'Linkin teksti', type: 'string' }),
          defineField({ name: 'file',  title: 'Tiedosto',      type: 'file', validation: (R) => R.required() }),
        ],
        preview: {
          select:  { title: 'title', fname: 'file.asset.originalFilename' },
          prepare: ({ title, fname }) => ({ title: title || fname || '📎 Tiedosto' }),
        },
      }],
      description: 'Ladattavat tiedostot (esim. PDF) näytetään osion lopussa.',
    }),
  ],

  preview: {
    select: { title: 'headline', display: 'displayHeadline', bg: 'backgroundColor' },
    prepare: ({ title, display, bg }) => ({
      title:    display ? `✨ ${display}` : (title ?? 'Sektio'),
      subtitle: bg === 'pink' ? '🌸 Koralli' : bg === 'yellow' ? '🟡 Keltainen' : '🔵 Sininen',
    }),
  },
})
