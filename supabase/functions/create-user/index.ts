// 📁 supabase/functions/create-user/index.ts
// ✅ Edge Function PRO pour créer un utilisateur (admin ou technicien)
// 🔒 Nécessite le token SERVICE_ROLE dans l'appel côté client (admin seulement)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json()
  const { email, password, role, entreprise_id } = body

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (!email || !password || !role || !entreprise_id) {
    return new Response(JSON.stringify({ error: 'Champs requis manquants.' }), { status: 400 })
  }

  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError || !authUser?.user?.id) {
    return new Response(JSON.stringify({ error: 'Erreur création auth', details: authError }), { status: 500 })
  }

  // 2. Ajouter dans la table `users`
  const { error: insertError } = await supabaseAdmin.from('users').insert({
    id: authUser.user.id,
    email,
    role,
    entreprise_id
  })

  if (insertError) {
    return new Response(JSON.stringify({ error: 'Erreur insertion table users', details: insertError }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
