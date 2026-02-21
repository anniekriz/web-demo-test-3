import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

export default RootPage

export async function generateMetadata(
  args: Parameters<typeof generatePageMetadata>[0],
): Promise<Metadata> {
  return generatePageMetadata({
    ...args,
    config: configPromise,
  })
}