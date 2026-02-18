'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './PageClient.module.css'
import heroStyles from '@/components/sections/HeroSection.module.css'
import aboutStyles from '@/components/sections/AboutSection.module.css'
import { Header } from '@/components/layout/Header'
import { EditableText } from '@/components/editing/EditableText'
import { EditableRichText } from '@/components/editing/EditableRichText'
import { EditableImage } from '@/components/editing/EditableImage'
import { lexicalToPlainText } from '@/lib/richtext'
import type { PageData } from '@/lib/page'

type Props = {
  initialPage: PageData
  canEdit: boolean
  role: string | null
}

type LocalImage = { file: File; previewUrl: string; alt: string }

export function PageClient({ initialPage, canEdit }: Props) {
  const [original, setOriginal] = useState(initialPage)
  const [draft, setDraft] = useState(initialPage)
  const [editing, setEditing] = useState(false)
  const [heroPending, setHeroPending] = useState<LocalImage | null>(null)
  const [aboutPending, setAboutPending] = useState<LocalImage | null>(null)
  const [showDiscard, setShowDiscard] = useState(false)

  const dirty = useMemo(() => {
    return (
      JSON.stringify(draft) !== JSON.stringify(original) ||
      heroPending !== null ||
      aboutPending !== null
    )
  }, [draft, original, heroPending, aboutPending])

  useEffect(() => {
    if (!dirty) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const ctaHref = draft.heroCta.linkType === 'anchor'
    ? `#${draft.heroCta.anchorId ?? 'about'}`
    : draft.heroCta.linkType === 'external'
      ? draft.heroCta.externalUrl ?? '#'
      : `/${typeof draft.heroCta.internalPage === 'object' ? draft.heroCta.internalPage.slug : draft.heroCta.internalPage ?? ''}`

  const heroSrc = heroPending?.previewUrl || `${draft.heroImage.url}?v=${encodeURIComponent(draft.heroImage.updatedAt ?? draft.updatedAt)}`
  const aboutSrc = aboutPending?.previewUrl || `${draft.aboutImage.url}?v=${encodeURIComponent(draft.aboutImage.updatedAt ?? draft.updatedAt)}`

  const uploadMedia = async (file: File, alt: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('alt', alt)

    const response = await fetch('/api/media', {
      method: 'POST',
      body: form,
      credentials: 'include',
    })

    if (!response.ok) throw new Error('Media upload failed')
    return response.json()
  }

  const onSave = async () => {
    if (!draft.heroHeadline || !draft.heroSubheadline || !draft.heroCta.text || !draft.aboutHeading || !lexicalToPlainText(draft.aboutBody)) {
      alert('Please fill all required text fields.')
      return
    }

    if ((heroPending && !heroPending.alt.trim()) || (aboutPending && !aboutPending.alt.trim())) {
      alert('Alt text is required for newly selected images.')
      return
    }

    let heroImage = draft.heroImage
    let aboutImage = draft.aboutImage

    if (heroPending) {
      const media = await uploadMedia(heroPending.file, heroPending.alt)
      heroImage = { id: String(media.doc.id), alt: media.doc.alt, url: media.doc.url, updatedAt: media.doc.updatedAt }
    }

    if (aboutPending) {
      const media = await uploadMedia(aboutPending.file, aboutPending.alt)
      aboutImage = { id: String(media.doc.id), alt: media.doc.alt, url: media.doc.url, updatedAt: media.doc.updatedAt }
    }

    const response = await fetch(`/api/pages/${draft.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        heroHeadline: draft.heroHeadline,
        heroSubheadline: draft.heroSubheadline,
        heroCta: draft.heroCta,
        heroImage: heroImage.id,
        aboutHeading: draft.aboutHeading,
        aboutBody: draft.aboutBody,
        aboutImage: aboutImage.id,
      }),
    })

    if (!response.ok) {
      alert('Save failed.')
      return
    }

    const payload = await response.json()
    const updated: PageData = {
      ...draft,
      heroImage,
      aboutImage,
      updatedAt: payload.doc.updatedAt,
    }

    setOriginal(updated)
    setDraft(updated)
    if (heroPending) URL.revokeObjectURL(heroPending.previewUrl)
    if (aboutPending) URL.revokeObjectURL(aboutPending.previewUrl)
    setHeroPending(null)
    setAboutPending(null)
  }

  const exitEditing = () => {
    if (dirty) {
      setShowDiscard(true)
      return
    }

    setEditing(false)
  }

  const discardChanges = () => {
    if (heroPending) URL.revokeObjectURL(heroPending.previewUrl)
    if (aboutPending) URL.revokeObjectURL(aboutPending.previewUrl)
    setHeroPending(null)
    setAboutPending(null)
    setDraft(original)
    setEditing(false)
    setShowDiscard(false)
  }

  return (
    <div className={styles.page}>
      <Header canEdit={canEdit} isEditing={editing} dirty={dirty} onEdit={() => setEditing(true)} onSave={onSave} onExit={exitEditing} />
      <main className={styles.main}>
        <section className={heroStyles.section}>
          <div className={heroStyles.copy}>
            <EditableText tag="h1" value={draft.heroHeadline} editing={editing} onChange={(next) => setDraft((prev) => ({ ...prev, heroHeadline: next }))} />
            <EditableText tag="p" value={draft.heroSubheadline} editing={editing} onChange={(next) => setDraft((prev) => ({ ...prev, heroSubheadline: next }))} />
            <Link
              className={`${heroStyles.cta} ${editing ? styles.linkFallback : ''}`}
              href={ctaHref}
              target={draft.heroCta.newTab ? '_blank' : undefined}
            >
              <EditableText
                tag="span"
                value={draft.heroCta.text}
                editing={editing}
                onChange={(next) => setDraft((prev) => ({ ...prev, heroCta: { ...prev.heroCta, text: next } }))}
              />
            </Link>
          </div>

          <EditableImage
            editing={editing}
            needsAlt={Boolean(heroPending)}
            alt={heroPending?.alt ?? ''}
            onAltChange={(alt) => setHeroPending((prev) => (prev ? { ...prev, alt } : prev))}
            onSelect={(file) => {
              const url = URL.createObjectURL(file)
              if (heroPending) URL.revokeObjectURL(heroPending.previewUrl)
              setHeroPending({ file, previewUrl: url, alt: '' })
            }}
          >
            <div className={heroStyles.imageFrame}>
              <img className={heroStyles.image} src={heroSrc} alt={heroPending?.alt || draft.heroImage.alt} />
            </div>
          </EditableImage>
        </section>

        <section id="about" className={aboutStyles.section}>
          <div>
            <EditableText tag="h2" value={draft.aboutHeading} editing={editing} onChange={(next) => setDraft((prev) => ({ ...prev, aboutHeading: next }))} />
            <EditableRichText value={draft.aboutBody} editing={editing} onChange={(next) => setDraft((prev) => ({ ...prev, aboutBody: next }))} />
          </div>

          <EditableImage
            editing={editing}
            needsAlt={Boolean(aboutPending)}
            alt={aboutPending?.alt ?? ''}
            onAltChange={(alt) => setAboutPending((prev) => (prev ? { ...prev, alt } : prev))}
            onSelect={(file) => {
              const url = URL.createObjectURL(file)
              if (aboutPending) URL.revokeObjectURL(aboutPending.previewUrl)
              setAboutPending({ file, previewUrl: url, alt: '' })
            }}
          >
            <div className={aboutStyles.imageFrame}>
              <img className={aboutStyles.image} src={aboutSrc} alt={aboutPending?.alt || draft.aboutImage.alt} />
            </div>
          </EditableImage>
        </section>
        <footer className={styles.footer}>© {new Date().getFullYear()} Neo World Weby</footer>
      </main>

      {showDiscard && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p>Discard changes?</p>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowDiscard(false)}>
                Cancel
              </button>
              <button type="button" onClick={discardChanges}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
