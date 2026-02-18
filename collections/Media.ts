import type { CollectionConfig } from 'payload'
import { isAdminOrOwner } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrOwner,
    update: isAdminOrOwner,
    delete: isAdminOrOwner,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
