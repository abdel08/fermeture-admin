'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (!user || error) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      // On récupère l’entreprise_id de l'utilisateur connecté
      const { data: myUser, error: userError } = await supabase
        .from('users')
        .select('id, entreprise_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!myUser || userError) {
        console.error('Utilisateur non trouvé dans la table `users` ou erreur Supabase', userError)
        setError("Impossible de récupérer l'entreprise associée.")
        setLoading(false)
        return
      }

      // On récupère les autres utilisateurs de la même entreprise
      const { data: usersList, error: listError } = await supabase
        .from('users')
        .select('email, role, id')
        .eq('entreprise_id', myUser.entreprise_id)

      if (listError) {
        console.error('Erreur lors du chargement des utilisateurs', listError)
        setError("Erreur de chargement.")
        setLoading(false)
        return
      }

      setUsers(usersList || [])
      setLoading(false)
    }

    fetchUserAndData()
  }, [])

  if (loading) return <p className="p-4">Chargement...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Dashboard Admin</h1>
      <p className="mb-4">Bienvenue {user.email}</p>

      <h2 className="font-semibold mb-2">Utilisateurs de ton entreprise :</h2>
      <ul className="list-disc ml-6">
        {users.map(u => (
          <li key={u.id}>
            {u.email} — <span className="italic">{u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
