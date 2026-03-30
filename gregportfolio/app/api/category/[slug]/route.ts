import { NextResponse } from 'next/server'
import { sanityClient, categoryGalleryQuery } from '../../../../sanity/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!sanityClient) {
    return NextResponse.json({ images: [], source: 'local' })
  }

  try {
    const results = await sanityClient.fetch(categoryGalleryQuery, { category: slug })
    if (!results || results.length === 0) {
      return NextResponse.json({ images: [], source: 'local' })
    }
    const images = results.map((item: { imageUrl: string }) => item.imageUrl)
    return NextResponse.json({ images, source: 'sanity' })
  } catch {
    return NextResponse.json({ images: [], source: 'local' })
  }
}
