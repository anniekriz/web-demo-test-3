'use client'

import styles from './EditableText.module.css'

type Props = {
  tag: 'h1' | 'h2' | 'p' | 'span'
  value: string
  editing: boolean
  className?: string
  onChange: (next: string) => void
}

export function EditableText({ tag: Tag, value, editing, className, onChange }: Props) {
  return (
    <Tag
      className={`${styles.editable} ${editing ? styles.editing : ''} ${className ?? ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.textContent ?? '')}
    >
      {value}
    </Tag>
  )
}
