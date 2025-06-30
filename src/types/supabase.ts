export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          entreprise_id: string
          role: 'admin' | 'technicien'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          entreprise_id: string
          role: 'admin' | 'technicien'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      entreprises: {
        Row: {
          id: string
          nom: string
          adresse: string
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          adresse: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['entreprises']['Insert']>
      }
    }
  }
}
