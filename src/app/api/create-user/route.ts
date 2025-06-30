// 📁 src/app/api/create-user/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📨 Reçu dans l’API :', body)

    const { email, password, role, entreprise_id } = body

    if (!email || !password || !role || !entreprise_id) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ✅ Étape 1 : Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authUser?.user?.id) {
      console.error('❌ Erreur création utilisateur Auth :', authError)
      return NextResponse.json({ error: 'Erreur auth', details: authError }, { status: 500 })
    }

    // ✅ Étape 2 : Insérer l'utilisateur dans la table `users`
    const { error: insertError } = await supabase.from('users').insert({
      id: authUser.user.id,           // 🟢 ID synchronisé
      email,
      role,
      entreprise_id,
    })

    if (insertError) {
      console.error('❌ Erreur insertion DB :', insertError)
      return NextResponse.json({ error: 'Erreur insert', details: insertError }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('🔥 Erreur serveur :', error)
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 })
  }
}
