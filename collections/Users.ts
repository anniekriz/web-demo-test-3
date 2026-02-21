import type { CollectionConfig, PayloadRequest } from 'payload'
import { isAdmin } from '@/lib/access'

const canAccessUsersAdmin = async ({ req }: { req: PayloadRequest }): Promise<boolean> => {
  const result = await Promise.resolve(isAdmin({ req } as any))
  return result === true
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: canAccessUsersAdmin, 
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'owner',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Owner', value: 'owner' },
      ],
    },
  ],
}