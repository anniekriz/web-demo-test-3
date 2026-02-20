import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'

export type CmsMedia = {
  id: string
  alt: string
  url: string
  updatedAt?: string
}

export type PageData = {
  id: string
  slug: string
  title: string
  heroHeadline: string
  heroSubheadline: string
  heroCta: {
    text: string
    linkType: 'internal' | 'external' | 'anchor'
    internalPage?: string | { slug: string } | null
    externalUrl?: string
    anchorId?: string
    newTab?: boolean
  }
  heroImage: CmsMedia
  aboutHeading: string
  aboutBody: unknown
  aboutImage: CmsMedia
  updatedAt: string
}

export const canUserEdit = (role?: string | null) => role === 'admin' || role === 'owner'

export const getCurrentUser = async () => {
  const payload = await getPayloadClient()
  const result = await payload.auth({ headers: await headers() })
  return result.user as { role?: string } | null
}

const normalizeMedia = (value: any): CmsMedia => ({
  id: String(value.id),
  alt: value.alt,
  url: value.url,
  updatedAt: value.updatedAt,
})

export const getPageBySlug = async (slug: string): Promise<PageData> => {
  const payload = await getPayloadClient()
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const page = pageResult.docs[0]

  if (!page) {
    notFound()
  }

  return {
    id: String(page.id),
    slug: page.slug,
    title: page.title,
    heroHeadline: page.heroHeadline,
    heroSubheadline: page.heroSubheadline,
    heroCta: page.heroCta,
    heroImage: normalizeMedia(page.heroImage),
    aboutHeading: page.aboutHeading,
    aboutBody: page.aboutBody,
    aboutImage: normalizeMedia(page.aboutImage),
    updatedAt: page.updatedAt,
  }
}
