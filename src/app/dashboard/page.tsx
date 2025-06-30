// src/app/dashboard/page.tsx
import { getUserWithEntreprise } from '@/utils/supabase/getUserWithEntreprise'
import CreateUserForm from '@/components/CreateUserForm'

export default async function Dashboard() {
  const { entreprise } = await getUserWithEntreprise()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Espace Admin</h1>
      <p className="mb-2">Entreprise : <strong>{entreprise.nom}</strong></p>
      <CreateUserForm entrepriseId={entreprise.id} />
    </div>
  )
}
