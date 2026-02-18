import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdminOrOwner } from '@/lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: isAdminOrOwner,
    update: isAdminOrOwner,
    delete: isAdminOrOwner,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'heroHeadline', type: 'text', required: true },
    { name: 'heroSubheadline', type: 'text', required: true },
    {
      name: 'heroCta',
      type: 'group',
      required: true,
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          name: 'linkType',
          type: 'radio',
          required: true,
          defaultValue: 'anchor',
          options: [
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
            { label: 'Anchor', value: 'anchor' },
          ],
        },
        {
          name: 'internalPage',
          type: 'relationship',
          relationTo: 'pages',
          admin: { condition: (_, siblingData) => siblingData?.linkType === 'internal' },
          required: true,
        },
        {
          name: 'externalUrl',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.linkType === 'external' },
          required: true,
        },
        {
          name: 'anchorId',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.linkType === 'anchor' },
          required: true,
        },
        { name: 'newTab', type: 'checkbox' },
      ],
      validate: (value) => {
        if (!value) return 'CTA is required'
        if (value.linkType === 'internal' && !value.internalPage) return 'Internal page is required'
        if (value.linkType === 'external' && !value.externalUrl) return 'External URL is required'
        if (value.linkType === 'anchor' && !value.anchorId) return 'Anchor ID is required'
        return true
      },
    },
    { name: 'heroImage', type: 'relationship', relationTo: 'media', required: true },
    { name: 'aboutHeading', type: 'text', required: true },
    {
      name: 'aboutBody',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    { name: 'aboutImage', type: 'relationship', relationTo: 'media', required: true },
  ],
}
