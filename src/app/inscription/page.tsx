'use client'

import { useState } from 'react'

export default function PageInscription() {
  const [nomEntreprise, setNomEntreprise] = useState('')
  const [adresse, setAdresse] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/create-entreprise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomEntreprise, adresse, email, motDePasse })
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.error || 'Erreur lors de l’inscription.')
    } else {
      setMessage('✅ Entreprise et admin créés avec succès !')
      // tu peux rediriger ici si besoin
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 border rounded bg-white space-y-4">
      <h1 className="text-2xl font-bold">Créer une entreprise</h1>

      <input
        type="text"
        placeholder="Nom de l’entreprise"
        value={nomEntreprise}
        onChange={e => setNomEntreprise(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Adresse"
        value={adresse}
        onChange={e => setAdresse(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Email admin"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={e => setMotDePasse(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Création...' : 'Créer l’entreprise'}
      </button>

      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  )
}
