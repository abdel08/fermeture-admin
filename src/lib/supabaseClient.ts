import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://angskzahnqfgheuzkspe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ3NremFobnFmZ2hldXprc3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjA5MTIsImV4cCI6MjA2NjY5NjkxMn0.gyvkDAe2UziycwRcOQ0ueAbVyrZa4XE8jNIKBczpISA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
