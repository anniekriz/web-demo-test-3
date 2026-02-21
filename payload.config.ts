import path from 'path'
import fs from 'node:fs'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'

import { Pages } from '@/collections/Pages'
import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Najdi root projektu tak, aby to fungovalo jak když je payload.config v rootu,
// tak když je třeba v /src. (Next app dir máš podle erroru v rootu jako "app/...".)
const rootDir = fs.existsSync(path.resolve(dirname, 'app'))
  ? dirname
  : path.resolve(dirname, '..')

// baseDir pro component paths (pokud používáš "@/..." z /src, je praktické mířit do /src)
// – pokud /src neexistuje, použije se root.
const srcDir = path.resolve(rootDir, 'src')
const baseDir = fs.existsSync(srcDir) ? srcDir : rootDir

export default buildConfig({
  // ✅ správná konfigurace admin routy je přes "routes.admin"
  routes: {
    admin: '/cms',
  },

  admin: {
    user: Users.slug,

    // ✅ importMap defaultně míří do app/(payload)/admin/importMap.js,
    // ale ty máš route /cms → přesměruj ho do app/(payload)/cms/importMap.js
    importMap: {
      baseDir,
      importMapFile: path.resolve(rootDir, 'app', '(payload)', 'cms', 'importMap.js'),
    },
  },

  collections: [Users, Media, Pages],
  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  secret: process.env.PAYLOAD_SECRET || 'change-me',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})