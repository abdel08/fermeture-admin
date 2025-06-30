import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function getUserWithEntreprise() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  const user = session?.user

  if (sessionError || !user) {
    throw new Error('Utilisateur non connecté')
  }

  console.log('🟡 USER connecté :', user)

  const { data: usersRow, error: userError } = await supabase
    .from('users')
    .select('*, entreprises (*)') // 🟢 essaie avec entreprises directement
    .eq('id', user.id) // 🧠 'id' correspond au champ dans la table 'users'
    .single()

  console.log('🟡 Résultat user + entreprise :', usersRow)

  if (userError || !usersRow || !usersRow.entreprises) {
    console.log('🔴 ERREUR récupération user + entreprise', { usersRow, userError })
    throw new Error('Utilisateur ou entreprise introuvable')
  }

  return {
    user: usersRow,
    entreprise: usersRow.entreprises,
  }
}
