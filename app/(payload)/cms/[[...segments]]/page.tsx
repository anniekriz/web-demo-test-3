import type { Metadata } from 'next'
import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

type PageProps = {
  params: { segments?: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const generateMetadata = async (
  { params, searchParams }: PageProps,
): Promise<Metadata> => {
  return generatePageMetadata({ config, params, searchParams })
}

const Page = ({ params, searchParams }: PageProps) => {
  return RootPage({ config, params, searchParams })
}

export default Page