import { getUserWithEntreprise } from '@/utils/supabase/getUserWithEntreprise'
import CreateUserForm from '@/components/CreateUserForm'

export default async function Dashboard() {
  const { entreprise } = await getUserWithEntreprise()

  if (!entreprise) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">❌ Entreprise introuvable</h1>
        <p>Veuillez vérifier que votre compte est bien rattaché à une entreprise.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Espace Admin</h1>
      <CreateUserForm entrepriseId={entreprise.id} />
    </div>
  )
}
