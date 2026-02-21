import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type RawSearchParams = { [key: string]: string | string[] | undefined }
type CleanSearchParams = { [key: string]: string | string[] }

type PageArgs = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<RawSearchParams>
}

const normalizeSearchParams = (
  searchParams: Promise<RawSearchParams>,
): Promise<CleanSearchParams> =>
  searchParams.then((sp) => {
    const out: CleanSearchParams = {}

    for (const [key, value] of Object.entries(sp)) {
      if (value !== undefined) out[key] = value
    }

    return out
  })

export const generateMetadata = ({ params, searchParams }: PageArgs): Promise<Metadata> => {
  const normalizedParams = params.then(({ segments }) => ({ segments: segments ?? [] }))
  const normalizedSearchParams = normalizeSearchParams(searchParams)

  return generatePageMetadata({
    config: configPromise,
    params: normalizedParams,
    searchParams: normalizedSearchParams,
  })
}

export default function Page({ params, searchParams }: PageArgs) {
  const normalizedParams = params.then(({ segments }) => ({ segments: segments ?? [] }))
  const normalizedSearchParams = normalizeSearchParams(searchParams)

  return RootPage({
    config: configPromise,
    importMap,
    params: normalizedParams,
    searchParams: normalizedSearchParams,
  })
}