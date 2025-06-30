import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types_db'

export async function getUserWithEntreprise() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Utilisateur non connecté')
  }

  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('*, entreprise(*)') // nom de la relation automatique par Supabase
    .eq('id', user.id)
    .single()

  if (fetchError || !userData || !userData.entreprise) {
    throw new Error('Utilisateur ou entreprise introuvable')
  }

  return {
    user: userData,
    entreprise: userData.entreprise, // note bien le "s"
  }
}
