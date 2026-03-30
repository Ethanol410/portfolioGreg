import { defineType, defineField } from 'sanity'

export const gallerySchema = defineType({
  name: 'galleryImage',
  title: 'Image Galerie',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      description: 'Où cette image doit-elle apparaître ?',
      type: 'string',
      options: {
        list: [
          { title: '🏠 Page d\'accueil (galerie défilante)', value: 'homepage' },
          { title: '📁 Page catégorie (/work/...)', value: 'category' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      description: 'Uniquement si "Page catégorie" est sélectionné ci-dessus',
      type: 'string',
      hidden: ({ document }) => document?.section !== 'category',
      options: {
        list: [
          { title: 'Automobile', value: 'automotive' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Contenu de Marque', value: 'brand' },
          { title: 'Evenementiel', value: 'evenementiel' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Ordre',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'image', subtitle: 'section', cat: 'category' },
    prepare({ title, media, subtitle, cat }) {
      const label = subtitle === 'homepage' ? '🏠 Accueil' : `📁 ${cat ?? 'Catégorie'}`
      return { title: title ?? 'Sans titre', subtitle: label, media }
    },
  },
})
