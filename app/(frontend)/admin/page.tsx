'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './admin.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const returnTo = params.get('returnTo') || '/'

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      setError('Invalid credentials.')
      return
    }

    router.push(returnTo)
    router.refresh()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>Client Login</h1>
        <p>Sign in to enable in-place editing.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <input className={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input className={styles.input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.button} type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}
