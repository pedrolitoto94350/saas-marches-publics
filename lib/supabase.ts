import { createClient } from '@supabase/supabase-js'

// Vérification des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Mode simulation si Supabase n'est pas configuré
const useMock = !supabaseUrl || !supabaseAnonKey || process.env.NODE_ENV === 'development'

let supabase: any

if (useMock) {
  console.warn('Using mock Supabase client for development/demo')
  
  // Client mock pour le développement
  supabase = {
    auth: {
      getSession: async () => ({ 
        data: { session: null }, 
        error: null 
      }),
      signInWithPassword: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      signUp: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Simuler un changement d'état
        setTimeout(() => {
          callback('SIGNED_IN', {
            user: { id: 'demo-user', email: 'demo@example.com' }
          })
        }, 1000)
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
    },
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => ({ 
            data: { id: 'demo-analysis', filename: 'demo.pdf' }, 
            error: null 
          })
        })
      }),
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({ 
              data: [], 
              error: null 
            })
          })
        })
      })
    })
  }
} else {
  // Vrai client Supabase
  console.log('Using real Supabase client')
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }