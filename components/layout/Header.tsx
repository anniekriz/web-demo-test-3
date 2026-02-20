import styles from './Header.module.css'

type Props = {
  canEdit: boolean
  isEditing: boolean
  dirty: boolean
  onEdit: () => void
  onSave: () => void
  onExit: () => void
}

export function Header({ canEdit, isEditing, dirty, onEdit, onSave, onExit }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>Neo World Weby</div>
      {canEdit && (
        <div className={styles.controls}>
          {!isEditing ? (
            <button className={styles.button} onClick={onEdit} type="button">
              Edit
            </button>
          ) : (
            <>
              <button className={`${styles.button} ${styles.primary}`} onClick={onSave} type="button" disabled={!dirty}>
                Save
              </button>
              <button className={styles.button} onClick={onExit} type="button">
                Exit
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
