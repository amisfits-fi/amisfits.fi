import { defineType, defineField } from 'sanity'

/**
 * Amisfits-testi — kielikohtainen dokumentti (quiz-fi, quiz-se, quiz-en).
 *
 * Sama malli kuin FAQ:ssa: nuorille ja aikuisille omat tekstikentät.
 * Aikuiskentän voi jättää tyhjäksi, jolloin käytetään nuorten tekstiä.
 *
 * Pisteytys (vahvistettu Sarilta 7/2026):
 *  - Aikuiset: kysymykset 1–5, vaihtoehdot a/b/c = vihreä, d = keltainen
 *  - Nuoret:   kysymykset 1–4 kuten yllä, kysymyksessä 5 kaikki = vihreä
 * Väri asetetaan per vaihtoehto erikseen molemmille kohderyhmille.
 */

const COLOR_OPTIONS = {
  list: [
    { title: '🟢 Vihreä (amis sopii)', value: 'green' },
    { title: '🟡 Keltainen (amis saattaa sopia)', value: 'yellow' },
  ],
  layout: 'radio' as const,
}

// Rikastekstikenttä samoilla tyyleillä kuin FAQ-vastauksissa
const bodyStyles = [
  { title: 'Normaali',          value: 'normal' },
  { title: 'Väliotsikko',       value: 'h3' },
  { title: 'Pieni väliotsikko', value: 'h4' },
]

export default defineType({
  name:  'quiz',
  title: 'Amisfits-testi',
  type:  'document',
  // Estetään useampi kuin yksi dokumentti per kieli (lukittu structure-toolissa)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name:    'language',
      title:   'Kieli',
      type:    'string',
      options: {
        list: [
          { title: '🇫🇮 Suomi',   value: 'fi' },
          { title: '🇸🇪 Svenska', value: 'se' },
          { title: '🇬🇧 English', value: 'en' },
        ],
        layout: 'radio',
      },
      readOnly: true,
      validation: (R) => R.required(),
    }),

    // ── Aloitusnäkymä ────────────────────────────────────────────
    defineField({
      name:  'titleYouth',
      title: '👦 Otsikko – Peruskoulunuoret',
      type:  'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name:  'leadYouth',
      title: '👦 Aloitusteksti – Peruskoulunuoret',
      type:  'string',
    }),
    defineField({
      name:  'titleAdult',
      title: '🎓 Otsikko – Aikuisopiskelijat',
      type:  'string',
      description: 'Jätä tyhjäksi jos sama kuin nuorille.',
    }),
    defineField({
      name:  'leadAdult',
      title: '🎓 Aloitusteksti – Aikuisopiskelijat',
      type:  'string',
      description: 'Jätä tyhjäksi jos sama kuin nuorille.',
    }),

    // ── Kysymykset ───────────────────────────────────────────────
    defineField({
      name:  'questions',
      title: 'Kysymykset',
      type:  'array',
      validation: (R) => R.min(1),
      of: [{
        type:  'object',
        name:  'quizQuestion',
        title: 'Kysymys',
        fields: [
          defineField({
            name:  'questionYouth',
            title: '👦 Kysymys – Peruskoulunuoret',
            type:  'string',
            validation: (R) => R.required(),
          }),
          defineField({
            name:  'questionAdult',
            title: '🎓 Kysymys – Aikuisopiskelijat',
            type:  'string',
            description: 'Jätä tyhjäksi jos sama kuin nuorille.',
          }),
          defineField({
            name:  'options',
            title: 'Vastausvaihtoehdot',
            type:  'array',
            validation: (R) => R.min(2).max(6),
            of: [{
              type:  'object',
              name:  'quizOption',
              title: 'Vaihtoehto',
              fields: [
                defineField({
                  name:  'textYouth',
                  title: '👦 Teksti – Peruskoulunuoret',
                  type:  'string',
                  validation: (R) => R.required(),
                }),
                defineField({
                  name:  'textAdult',
                  title: '🎓 Teksti – Aikuisopiskelijat',
                  type:  'string',
                  description: 'Jätä tyhjäksi jos sama kuin nuorille.',
                }),
                defineField({
                  name:    'colorYouth',
                  title:   '👦 Väri – Peruskoulunuoret',
                  type:    'string',
                  options: COLOR_OPTIONS,
                  initialValue: 'green',
                  validation: (R) => R.required(),
                }),
                defineField({
                  name:    'colorAdult',
                  title:   '🎓 Väri – Aikuisopiskelijat',
                  type:    'string',
                  options: COLOR_OPTIONS,
                  initialValue: 'green',
                  validation: (R) => R.required(),
                }),
              ],
              preview: {
                select: { title: 'textYouth', colorYouth: 'colorYouth', colorAdult: 'colorAdult' },
                prepare: ({ title, colorYouth, colorAdult }) => ({
                  title: title ?? 'Vaihtoehto',
                  subtitle: `👦 ${colorYouth === 'yellow' ? '🟡' : '🟢'}  🎓 ${colorAdult === 'yellow' ? '🟡' : '🟢'}`,
                }),
              },
            }],
          }),
        ],
        preview: {
          select: { title: 'questionYouth' },
          prepare: ({ title }) => ({ title: title ?? 'Kysymys' }),
        },
      }],
    }),

    // ── Palautetekstit ───────────────────────────────────────────
    defineField({
      name:  'results',
      title: 'Palautetekstit',
      type:  'array',
      description: 'Yksi palaute per väri: vihreä ja keltainen.',
      validation: (R) => R.min(1).max(2),
      of: [{
        type:  'object',
        name:  'quizResult',
        title: 'Palaute',
        fields: [
          defineField({
            name:    'category',
            title:   'Väri',
            type:    'string',
            options: COLOR_OPTIONS,
            validation: (R) => R.required(),
          }),
          defineField({
            name:  'headingYouth',
            title: '👦 Otsikko – Peruskoulunuoret',
            type:  'string',
            description: 'Esim. "Amis voisi sopia sulle tosi hyvin!"',
          }),
          defineField({
            name:  'bodyYouth',
            title: '👦 Palauteteksti – Peruskoulunuoret',
            type:  'array',
            of:    [{ type: 'block', styles: bodyStyles }],
          }),
          defineField({
            name:  'sloganYouth',
            title: '👦 Loppuslogan – Peruskoulunuoret',
            type:  'string',
            description: 'Esim. "Amis voi olla just sun reitti!"',
          }),
          defineField({
            name:  'headingAdult',
            title: '🎓 Otsikko – Aikuisopiskelijat',
            type:  'string',
            description: 'Jätä tyhjäksi jos sama kuin nuorille.',
          }),
          defineField({
            name:  'bodyAdult',
            title: '🎓 Palauteteksti – Aikuisopiskelijat',
            type:  'array',
            of:    [{ type: 'block', styles: bodyStyles }],
            description: 'Jätä tyhjäksi jos sama kuin nuorille.',
          }),
          defineField({
            name:  'sloganAdult',
            title: '🎓 Loppuslogan – Aikuisopiskelijat',
            type:  'string',
            description: 'Jätä tyhjäksi jos sama kuin nuorille.',
          }),
        ],
        preview: {
          select: { category: 'category', title: 'headingYouth' },
          prepare: ({ category, title }) => ({
            title: `${category === 'yellow' ? '🟡 Keltainen' : '🟢 Vihreä'} palaute`,
            subtitle: title,
          }),
        },
      }],
    }),

    // ── Toimintakehote tuloksen jälkeen ──────────────────────────
    defineField({
      name:  'ctaLabel',
      title: 'CTA-painikkeen teksti',
      type:  'string',
      description: 'Näytetään tuloksen jälkeen, esim. "Tutustu amikseen". Jätä tyhjäksi jos CTA:ta ei haluta.',
    }),
    defineField({
      name:  'ctaUrl',
      title: 'CTA-painikkeen osoite',
      type:  'url',
      validation: (R) => R.uri({ allowRelative: true, scheme: ['http', 'https'] }),
      description: 'Esim. https://opintopolku.fi tai sivuston oma osio.',
    }),
  ],

  preview: {
    select: { title: 'language' },
    prepare: ({ title }) => ({
      title: title === 'fi' ? '🇫🇮 Amisfits-testi (suomi)'
           : title === 'se' ? '🇸🇪 Amisfits-testi (ruotsi)'
           : '🇬🇧 Amisfits-testi (englanti)',
    }),
  },
})
