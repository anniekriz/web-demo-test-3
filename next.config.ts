import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/demo-web'

const nextConfig: NextConfig = {
  basePath,
  // aby se správně načítaly _next assety přes subpath
  assetPrefix: basePath,

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default withPayload(nextConfig)
