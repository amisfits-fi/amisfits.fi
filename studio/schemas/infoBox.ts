import { defineType, defineField } from 'sanity'

// ── Tietolaatikko ("Tiesitkö?", "Huomio!") ───────────────────────────────────
// Lisätään rikastekstin sekaan samasta "+"-valikosta kuin kuvat.
// Ulkoasu (sininen otsikkopalkki, valkoinen pohja, vino asento) tulee
// CSS:stä – sisällönsyöttäjä kirjoittaa vain otsikon ja tekstin.
// Puhelimessa laatikko asettuu aina tekstin väliin koko leveydelle.

export default defineType({
  name:  'infoBox',
  title: 'Tietolaatikko',
  type:  'object',
  fields: [
    defineField({
      name:        'title',
      title:       'Otsikko',
      type:        'string',
      description: 'Lyhyt huudahdus, esim. "Tiesitkö?" tai "Huomio!"',
      validation:  (R) => R.required().max(30),
    }),
    defineField({
      name:        'body',
      title:       'Teksti',
      type:        'array',
      description: 'Pidä lyhyenä – 2–4 virkettä toimii parhaiten.',
      of: [{
        type:   'block',
        styles: [{ title: 'Normaali', value: 'normal' }],
        lists:  [],
      }],
      validation: (R) => R.required(),
    }),
    defineField({
      name:         'placement',
      title:        'Sijoittelu tietokoneella',
      type:         'string',
      initialValue: 'right',
      options: {
        list: [
          { title: 'Oikealle, teksti kiertää',  value: 'right' },
          { title: 'Vasemmalle, teksti kiertää', value: 'left'  },
          { title: 'Koko palstan levyinen',      value: 'full'  },
        ],
        layout: 'radio',
      },
      description: 'Laatikko sijoittuu sen kappaleen viereen, jonka YLÄPUOLELLE se on lisätty. Puhelimessa laatikko on aina koko levyinen.',
    }),
    defineField({
      name:         'tilted',
      title:        'Vino asento',
      type:         'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select:  { title: 'title', placement: 'placement' },
    prepare: ({ title, placement }) => ({
      title:    `💬 ${title || 'Tietolaatikko'}`,
      subtitle: `Tietolaatikko · ${placement === 'left' ? 'vasemmalla' : placement === 'full' ? 'koko leveys' : 'oikealla'}`,
    }),
  },
})
