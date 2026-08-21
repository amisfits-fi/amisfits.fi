import { defineType, defineField } from 'sanity'

// ── Rikastekstikenttä – tukee lihavointia, kursiivia, linkkejä,
//    sekä tekstin sisään upotettavia KUVIA ja TIEDOSTOLIITTEITÄ ───────────────
const bodyField = (
  name: string,
  title: string,
  opts: { hidden?: (ctx: any) => boolean } = {},
) =>
  defineField({
    name,
    title,
    type:  'array',
    ...(opts.hidden ? { hidden: opts.hidden } : {}),
    of: [
      {
        type: 'block',
        // Väliotsikot tehdään oikeilla otsikkotyyleillä (ei lihavoinnilla),
        // jotta ruudunlukijat ja hakukoneet tunnistavat ne otsikoiksi.
        // Sektion oma otsikko on sivulla <h2>, joten väliotsikot ovat h3/h4.
        styles: [
          { title: 'Normaali',            value: 'normal' },
          { title: 'Väliotsikko',         value: 'h3' },
          { title: 'Pieni väliotsikko',   value: 'h4' },
        ],
      },
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

// Aikuisten kentät piilotetaan, kun "Käytä nuorten tekstiä myös aikuisille"
// on valittuna. Sisältö säilyy tallessa – kentät tulevat takaisin näkyviin
// heti kun valinta otetaan pois.
const hideWhenSameAsYouth = ({ parent }: any) => parent?.sameAsYouth === true

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

    defineField({
      name:         'hidePaths',
      title:        '🚫 Piilota polkupainikkeet (Ammattikorkeakouluun / Yliopistoon)',
      type:         'boolean',
      initialValue: false,
      description:  'Kun tämä on valittuna, tässä osiossa ei näytetä Ammattikorkeakouluun- eikä Yliopistoon-painiketta kummallekaan kohderyhmälle. Sopii esimerkiksi ensimmäiseen osioon, jossa kerrotaan vasta yleisesti ammatillisesta koulutuksesta. Painikkeiden tekstit säilyvät tallessa alla olevissa kentissä ja tulevat takaisin näkyviin heti kun otat valinnan pois.',
    }),

    // ── Nuorten sisältö ──────────────────────────────────────────
    bodyField('summaryYouth',     '👦 Tiivistelmä – Peruskoulunuoret (aina näkyvissä)'),
    bodyField('expandedYouth',    '👦 Polku ammattikorkeakouluun – Peruskoulunuoret (painike "Ammattikorkeakouluun")'),
    bodyField('expandedYouthUni', '👦 Polku yliopistoon – Peruskoulunuoret (painike "Yliopistoon")'),

    // ── Aikuisopiskelijoiden sisältö ─────────────────────────────
    defineField({
      name:         'sameAsYouth',
      title:        '🎓 Käytä nuorten tekstiä myös aikuisille',
      type:         'boolean',
      initialValue: false,
      description:  'Kun tämä on valittuna, aikuisten sivulla näytetään täsmälleen sama teksti kuin nuorten sivulla, eikä alla olevia aikuisten kenttiä tarvitse täyttää. Ota valinta pois, jos haluat kirjoittaa aikuisille oman tekstin.',
    }),

    bodyField('summaryAdult',     '🎓 Tiivistelmä – Aikuisopiskelijat (aina näkyvissä)',                              { hidden: hideWhenSameAsYouth }),
    bodyField('expandedAdult',    '🎓 Polku ammattikorkeakouluun – Aikuisopiskelijat (painike "Ammattikorkeakouluun")', { hidden: hideWhenSameAsYouth }),
    bodyField('expandedAdultUni', '🎓 Polku yliopistoon – Aikuisopiskelijat (painike "Yliopistoon")',                   { hidden: hideWhenSameAsYouth }),

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
    select: { title: 'headline', display: 'displayHeadline', bg: 'backgroundColor', same: 'sameAsYouth', noPaths: 'hidePaths' },
    prepare: ({ title, display, bg, same, noPaths }) => ({
      title:    display ? `✨ ${display}` : (title ?? 'Sektio'),
      subtitle: [
        bg === 'pink' ? '🌸 Koralli' : bg === 'yellow' ? '🟡 Keltainen' : '🔵 Sininen',
        same ? 'sama teksti aikuisille' : null,
        noPaths ? 'polkupainikkeet piilotettu' : null,
      ].filter(Boolean).join(' · '),
    }),
  },
})
