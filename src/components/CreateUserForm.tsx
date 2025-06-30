'use client'

import { useState } from 'react'

interface CreateUserFormProps {
  entrepriseId: string
}

export default function CreateUserForm({ entrepriseId }: CreateUserFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'technicien' | 'admin'>('technicien')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          entreprise_id: entrepriseId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue')
      }

      setMessage('✅ Utilisateur créé avec succès')
      setEmail('')
      setPassword('')
      setRole('technicien')
    } catch (err: any) {
      setMessage(`❌ Erreur : ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-md bg-white">
      <h2 className="text-lg font-bold">Créer un utilisateur</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={role}
        onChange={e => setRole(e.target.value as 'technicien' | 'admin')}
        className="w-full border p-2 rounded"
      >
        <option value="technicien">Technicien</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Création...' : 'Créer'}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}
