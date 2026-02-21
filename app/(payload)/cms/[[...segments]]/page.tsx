import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type PageArgs = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = ({ params, searchParams }: PageArgs): Promise<Metadata> => {
  const normalizedParams = params.then(({ segments }) => ({ segments: segments ?? [] }))

  return generatePageMetadata({
    config: configPromise,
    params: normalizedParams,
    searchParams,
  })
}

export default function Page({ params, searchParams }: PageArgs) {
  const normalizedParams = params.then(({ segments }) => ({ segments: segments ?? [] }))

  return RootPage({
    config: configPromise,
    importMap,
    params: normalizedParams,
    searchParams,
  })
}