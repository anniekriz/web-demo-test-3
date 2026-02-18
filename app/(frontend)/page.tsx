import { canUserEdit, getCurrentUser, getPageBySlug } from '@/lib/page'
import { PageClient } from '@/app/(frontend)/[slug]/PageClient'

export default async function HomePage() {
  const [page, user] = await Promise.all([getPageBySlug('home'), getCurrentUser()])

  return <PageClient initialPage={page} canEdit={canUserEdit(user?.role)} role={user?.role ?? null} />
}
