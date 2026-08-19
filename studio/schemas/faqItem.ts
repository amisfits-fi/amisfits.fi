import { defineType, defineField } from 'sanity'

export default defineType({
  name:  'faqItem',
  title: 'FAQ-kysymys',
  type:  'object',
  fields: [
    defineField({
      name:       'question',
      title:      'Kysymys',
      type:       'string',
      description: 'Sama kysymys näytetään molemmille kohderyhmille.',
      validation:  (R) => R.required(),
    }),

    defineField({
      name:  'answerYouth',
      title: '👦 Vastaus – Peruskoulunuoret',
      type:  'array',
      of:    [{
        type: 'block',
        styles: [
          { title: 'Normaali',          value: 'normal' },
          { title: 'Väliotsikko',       value: 'h3' },
          { title: 'Pieni väliotsikko', value: 'h4' },
        ],
      }],
    }),

    defineField({
      name:         'sameAsYouth',
      title:        '🎓 Käytä nuorten vastausta myös aikuisille',
      type:         'boolean',
      initialValue: false,
      description:  'Kun tämä on valittuna, aikuisten sivulla näytetään sama vastaus kuin nuorille, eikä alla olevaa kenttää tarvitse täyttää.',
    }),

    defineField({
      name:  'answerAdult',
      title: '🎓 Vastaus – Aikuisopiskelijat',
      type:  'array',
      of:    [{
        type: 'block',
        styles: [
          { title: 'Normaali',          value: 'normal' },
          { title: 'Väliotsikko',       value: 'h3' },
          { title: 'Pieni väliotsikko', value: 'h4' },
        ],
      }],
      hidden: ({ parent }: any) => parent?.sameAsYouth === true,
      description: 'Kirjoita tähän aikuisille oma vastaus. Jos vastaus on sama kuin nuorille, valitse yllä oleva ruutu – tyhjäksi jätetty kenttä näkyy aikuisten sivulla tyhjänä.',
    }),
  ],

  preview: {
    select: { title: 'question', same: 'sameAsYouth' },
    prepare: ({ title, same }) => ({
      title:    title ?? 'FAQ-kysymys',
      subtitle: same ? 'sama vastaus aikuisille' : undefined,
    }),
  },
})
