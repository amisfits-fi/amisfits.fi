import { defineType, defineField } from 'sanity'

export default defineType({
  name:  'onePager',
  title: 'One-pager',
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
          { title: '🇫🇮 Suomi',    value: 'fi' },
          { title: '🇸🇪 Svenska',  value: 'se' },
          { title: '🇬🇧 English',  value: 'en' },
        ],
        layout: 'radio',
      },
      readOnly: true, // Kieli asetetaan documentId:n mukaan, ei muuteta
      validation: (R) => R.required(),
    }),

    defineField({
      name:  'sections',
      title: 'Sektiot',
      type:  'array',
      of:    [{ type: 'section' }],
      validation: (R) => R.min(1).max(6),
      description: 'Leiskassa on 3 värillistä sektiota. Lisää ne tässä järjestyksessä.',
    }),

    defineField({
      name:  'faq',
      title: 'Usein kysyttyä',
      type:  'array',
      of:    [{ type: 'faqItem' }],
    }),

    defineField({
      name:        'partnerLogos',
      title:       'Kumppanilogot',
      type:        'array',
      of: [{
        type:   'image',
        options: { hotspot: false },
        fields: [
          defineField({
            name:  'alt',
            title: 'Kuvausteksti (saavutettavuus)',
            type:  'string',
          }),
        ],
      }],
      description: 'Logot näkyvät sivun alaosassa ruudukkona.',
    }),

    defineField({
      name:        'testCtaUrl',
      title:       'AMISFITS-testi URL',
      type:        'url',
      description: 'Täytetään kun testi-toteutustapa on päätetty. Jätetään tyhjäksi toistaiseksi.',
    }),
  ],

  preview: {
    select: { title: 'language' },
    prepare: ({ title }) => ({
      title: title === 'fi' ? '🇫🇮 Suomenkielinen sisältö'
           : title === 'se' ? '🇸🇪 Ruotsinkielinen sisältö'
           : '🇬🇧 Englanninkielinen sisältö',
    }),
  },
})
