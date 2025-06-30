'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/'
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Connexion Admin</h1>
      <input type="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" className="border p-2 w-full mb-4" onChange={e => setPassword(e.target.value)} />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2 w-full">Se connecter</button>
    </div>
  )
}
