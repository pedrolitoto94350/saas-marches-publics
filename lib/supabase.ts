import { createClient } from '@supabase/supabase-js';

// Vérification des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// FORCER LE MODE MOCK POUR DÉBLOQUER L'APPLICATION
const FORCE_MOCK = true; // À désactiver une fois Supabase configuré

// Log pour debug
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl ? 'SET' : 'MISSING',
  key: supabaseAnonKey ? 'SET (hidden)' : 'NOT SET',
  nodeEnv: process.env.NODE_ENV,
  forceMock: FORCE_MOCK,
});

let supabase: any;

if (FORCE_MOCK || !supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Using MOCK Supabase client (auth bypassed)');

  // Client mock complet
  supabase = {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: 'demo-user-id-123',
              email: 'demo@entreprise.fr',
              app_metadata: {},
              user_metadata: {},
            },
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
          },
        },
        error: null,
      }),
      signInWithPassword: async ({ email, password }: any) => {
        console.log(`🔐 Mock login: ${email}`);
        return {
          data: {
            user: {
              id: 'demo-user-id-123',
              email: email,
              app_metadata: {},
              user_metadata: {},
            },
            session: {
              access_token: 'mock-token',
              refresh_token: 'mock-refresh',
            },
          },
          error: null,
        };
      },
      signUp: async ({ email, password }: any) => ({
        data: {
          user: {
            id: 'demo-user-id-123',
            email: email,
          },
        },
        error: null,
      }),
      signOut: async () => {
        console.log('🔐 Mock logout');
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        // Simuler un utilisateur connecté
        setTimeout(() => {
          callback('SIGNED_IN', {
            session: {
              user: {
                id: 'demo-user-id-123',
                email: 'demo@entreprise.fr',
              },
            },
          });
        }, 500);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({
            data: {
              id: 'demo-analysis-' + Date.now(),
              ...data,
              created_at: new Date().toISOString(),
              status: 'completed',
            },
            error: null,
          }),
        }),
      }),
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (orderBy: string, options?: any) => ({
            limit: async (limit: number) => ({
              data: [
                {
                  id: 'demo-analysis-1',
                  filename: 'exemple-marche-public.pdf',
                  file_type: 'application/pdf',
                  status: 'completed',
                  created_at: new Date().toISOString(),
                  analysis_result: { summary: 'Analyse de démonstration' },
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }),
  };
} else {
  // Vrai client Supabase
  console.log('✅ Using real Supabase client');
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export { supabase };
