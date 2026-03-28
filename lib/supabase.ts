import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// ─── Validacion de variables de entorno ──────────────────────────────────────
// Este cliente es SERVER-SIDE ONLY. Nunca se instancia en el browser.
// La service role key bypasea Row Level Security — solo usar en API routes.

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Falta la variable de entorno SUPABASE_URL')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY')
}

// ─── Cliente singleton (server-side) ─────────────────────────────────────────
// Se usa en API routes para todas las operaciones de base de datos.
// No exportar ni usar en componentes de cliente (Client Components).

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      // Con service role key no se necesita persistir sesion
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
