// src/app/api/create-entreprise/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nomEntreprise, adresse, email, motDePasse } = body

    // Étape 1 : Créer le compte dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: motDePasse,
      email_confirm: true,
    })

    if (authError || !authUser.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Erreur création utilisateur' }, { status: 500 })
    }

    // Étape 2 : Créer l’entreprise
    const { data: entreprise, error: entrepriseError } = await supabase
      .from('entreprises')
      .insert([{ nom: nomEntreprise, adresse }])
      .select()
      .single()

    if (entrepriseError || !entreprise) {
      console.error('Erreur création entreprise:', entrepriseError)
      return NextResponse.json({ error: 'Erreur entreprise' }, { status: 500 })
    }

    // Étape 3 : Lier l'utilisateur à l’entreprise
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authUser.user.id,
        email,
        role: 'admin',
        entreprise_id: entreprise.id,
      }])

    if (userError) {
      console.error('Erreur insertion utilisateur:', userError)
      return NextResponse.json({ error: 'Erreur enregistrement utilisateur' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Erreur générale:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
