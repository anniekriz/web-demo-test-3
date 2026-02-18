import { redirect } from 'next/navigation'
import { canUserEdit, getCurrentUser } from '@/lib/page'

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    const returnTo = encodeURIComponent('/cms')
    if (!canUserEdit(user?.role)) {
      redirect(`/admin?returnTo=${returnTo}`)
    }
    redirect('/')
  }

  return children
}
