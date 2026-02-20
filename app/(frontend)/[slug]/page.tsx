import { canUserEdit, getCurrentUser, getPageBySlug } from '@/lib/page'
import { PageClient } from './PageClient'

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, user] = await Promise.all([getPageBySlug(slug), getCurrentUser()])

  return <PageClient initialPage={page} canEdit={canUserEdit(user?.role)} role={user?.role ?? null} />
}
