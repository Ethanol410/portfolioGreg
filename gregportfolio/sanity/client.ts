import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Photos de la page d'accueil
export const homepageGalleryQuery = `
  *[_type == "galleryImage" && section == "homepage"] | order(order asc) {
    _id,
    title,
    "imageUrl": image.asset->url,
  }
`

// Photos d'une page catégorie (/work/[slug])
export const categoryGalleryQuery = `
  *[_type == "galleryImage" && section == "category" && category == $category] | order(order asc) {
    _id,
    title,
    "imageUrl": image.asset->url,
  }
`
