import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

export default RootPage
export const generateMetadata = generatePageMetadata({ config })
