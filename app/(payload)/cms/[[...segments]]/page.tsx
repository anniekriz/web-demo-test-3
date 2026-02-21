import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

type NextPageProps = {
  params: { segments?: string[] }
  searchParams: Record<string, string | string[] | undefined>
}

export default function Page({ params, searchParams }: NextPageProps) {
  return (
    <RootPage
      config={configPromise}
      params={Promise.resolve({ segments: params.segments ?? [] })}
      searchParams={Promise.resolve(searchParams)}
    />
  )
}

// Varianta A (většinou stačí)
export const generateMetadata = generatePageMetadata({ config: configPromise })

/**
 * Kdyby Next pořád remcal na generateMetadata, dej místo varianty A tuhle variantu B:
 *
 * export async function generateMetadata({ params, searchParams }: NextPageProps) {
 *   const fn = generatePageMetadata({ config: configPromise })
 *   return fn({
 *     params: Promise.resolve({ segments: params.segments ?? [] }),
 *     searchParams: Promise.resolve(searchParams),
 *   } as any)
 * }
 */