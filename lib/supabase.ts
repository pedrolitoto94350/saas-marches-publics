import { createClient } from '@supabase/supabase-js'

// Vérification des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
  // En développement, on peut utiliser des valeurs par défaut
  if (process.env.NODE_ENV === 'development') {
    console.warn('Running in development mode without Supabase')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)