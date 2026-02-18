import path from 'path'
import { fileURLToPath } from 'url'
import config from '@payload-config'
import { getPayload } from 'payload'
import { plainTextToLexical } from '@/lib/richtext'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

const upsertUser = async (payload: Awaited<ReturnType<typeof getPayload>>, email: string, password: string, role: 'admin' | 'owner') => {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.docs[0]) return
  await payload.create({ collection: 'users', data: { email, password, role } })
}

const uploadMedia = async (payload: Awaited<ReturnType<typeof getPayload>>, filePath: string, alt: string) => {
  return payload.create({
    collection: 'media',
    data: { alt },
    filePath,
  })
}

const upsertPage = async (payload: Awaited<ReturnType<typeof getPayload>>, slug: string, data: Record<string, unknown>) => {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) {
    return payload.update({ collection: 'pages', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'pages', data: { ...data, slug } })
}

async function run() {
  requireEnv('DATABASE_URL')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
  const ownerEmail = process.env.SEED_OWNER_EMAIL || 'owner@example.com'
  const ownerPassword = process.env.SEED_OWNER_PASSWORD || 'ChangeMe123!'

  await upsertUser(payload, adminEmail, adminPassword, 'admin')
  await upsertUser(payload, ownerEmail, ownerPassword, 'owner')

  const hero = await uploadMedia(payload, path.resolve(dirname, '../seed-assets/hero.svg'), 'Hero preview')
  const about = await uploadMedia(payload, path.resolve(dirname, '../seed-assets/about.svg'), 'About preview')

  await upsertPage(payload, 'home', {
    title: 'Home',
    heroHeadline: 'Professional websites for non-technical teams',
    heroSubheadline: 'Neo World Weby lets your clients edit content safely, without breaking layouts.',
    heroCta: { text: 'Learn more', linkType: 'anchor', anchorId: 'about', newTab: false },
    heroImage: hero.id,
    aboutHeading: 'About Neo World Weby',
    aboutBody: plainTextToLexical('We craft premium template websites.\nClients edit content directly on-page, with zero layout shift.'),
    aboutImage: about.id,
  })

  await upsertPage(payload, 'contact', {
    title: 'Contact',
    heroHeadline: 'Contact Neo World Weby',
    heroSubheadline: 'Tell us your goals and we will prepare a template site plan.',
    heroCta: { text: 'Start now', linkType: 'anchor', anchorId: 'about', newTab: false },
    heroImage: hero.id,
    aboutHeading: 'Start a project',
    aboutBody: plainTextToLexical('Email us at hello@neo-world-weby.test\nWe respond within one business day.'),
    aboutImage: about.id,
  })

  console.log('Seed complete')
  console.log(`Admin: ${adminEmail} / ${adminPassword}`)
  console.log(`Owner: ${ownerEmail} / ${ownerPassword}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
