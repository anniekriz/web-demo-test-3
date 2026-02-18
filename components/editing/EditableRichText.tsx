'use client'

import styles from './EditableRichText.module.css'
import { lexicalToPlainText, plainTextToLexical } from '@/lib/richtext'

type Props = {
  value: unknown
  editing: boolean
  onChange: (next: unknown) => void
}

export function EditableRichText({ value, editing, onChange }: Props) {
  const text = lexicalToPlainText(value)
  return (
    <div
      className={`${styles.body} ${editing ? styles.editing : ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(event) => onChange(plainTextToLexical(event.currentTarget.innerText))}
    >
      {text.split('\n').map((line, index) => (
        <p key={`${line}-${index}`}>{line}</p>
      ))}
    </div>
  )
}
