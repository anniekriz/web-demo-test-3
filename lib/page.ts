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

const normalizeHeroCta = (value: any): PageData['heroCta'] => {
  const linkType: PageData['heroCta']['linkType'] =
    value?.linkType === 'internal' || value?.linkType === 'external' || value?.linkType === 'anchor'
      ? value.linkType
      : 'anchor'

  const out: PageData['heroCta'] = {
    text: typeof value?.text === 'string' ? value.text : '',
    linkType,
  }

  // internalPage: Payload relationship může být number (id) nebo celý Page objekt (při depth > 0)
  if (value?.internalPage === null) {
    out.internalPage = null
  } else if (typeof value?.internalPage === 'object' && value.internalPage) {
    const slug = (value.internalPage as any).slug
    if (typeof slug === 'string') {
      out.internalPage = { slug }
    } else if ((value.internalPage as any).id != null) {
      out.internalPage = String((value.internalPage as any).id)
    } else {
      out.internalPage = null
    }
  } else if (value?.internalPage != null) {
    out.internalPage = String(value.internalPage)
  }

  // null -> property radši vynechat (ať to sedí i při exactOptionalPropertyTypes)
  if (typeof value?.externalUrl === 'string') out.externalUrl = value.externalUrl
  if (typeof value?.anchorId === 'string') out.anchorId = value.anchorId
  if (typeof value?.newTab === 'boolean') out.newTab = value.newTab

  return out
}

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
    heroCta: normalizeHeroCta(page.heroCta),
    heroImage: normalizeMedia(page.heroImage),
    aboutHeading: page.aboutHeading,
    aboutBody: page.aboutBody,
    aboutImage: normalizeMedia(page.aboutImage),
    updatedAt: page.updatedAt,
  }
}
