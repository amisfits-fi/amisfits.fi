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
      description: 'Jätä tyhjäksi jos vastaus on sama kuin nuorille.',
    }),
  ],

  preview: {
    select: { title: 'question' },
    prepare: ({ title }) => ({ title: title ?? 'FAQ-kysymys' }),
  },
})
