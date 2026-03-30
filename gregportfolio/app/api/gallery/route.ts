import { NextResponse } from 'next/server'
import { sanityClient, homepageGalleryQuery } from '../../../sanity/client'

const FALLBACK_IMAGES = [
  "/pics/car/DSC03037-Enhanced-NR.jpg",
  "/pics/car/DSC00511.jpg",
  "/pics/car/DSC02570-Enhanced-NR.jpg",
  "/pics/portrait/DSC03090-Enhanced-NR.jpg",
  "/pics/car/DSC00904.jpg",
  "/pics/car/IMG_0616.jpeg",
  "/pics/car/DSC02671-Enhanced-NR.jpg",
  "/pics/car/DSC01439.jpg",
]

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

  if (!projectId) {
    return NextResponse.json({ images: FALLBACK_IMAGES, source: 'local' })
  }

  try {
    const results = await sanityClient.fetch(homepageGalleryQuery)

    if (!results || results.length === 0) {
      return NextResponse.json({ images: FALLBACK_IMAGES, source: 'local' })
    }

    const images = results.map((item: { imageUrl: string }) => item.imageUrl)
    return NextResponse.json({ images, source: 'sanity' })
  } catch {
    return NextResponse.json({ images: FALLBACK_IMAGES, source: 'local' })
  }
}
