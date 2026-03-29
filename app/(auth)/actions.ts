'use server'

import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'sb-kcawuvrvrxvzzrpuginw-auth-token'

type ActionState = { error?: string; redirectTo?: string }

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Completá todos los campos' }
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ email, password }),
    }
  )

  if (!res.ok) {
    return { error: 'Email o contraseña incorrectos' }
  }

  const session = await res.json()

  const cookieStore = await cookies()
  cookieStore.set(
    COOKIE_NAME,
    JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }
  )

  return { redirectTo: '/dashboard' }
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password || !confirmPassword) {
    return { error: 'Completá todos los campos' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' }
  }

  const { error: signUpError } = await supabase.auth.signUp({ email, password })

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes('already registered')) {
      return { error: 'Ya existe una cuenta con ese email' }
    }
    return { error: signUpError.message }
  }

  // Auto sign-in luego de registrarse
  const signInRes = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ email, password }),
    }
  )

  if (!signInRes.ok) {
    return { error: 'Cuenta creada. Verificá tu email para ingresar.' }
  }

  const session = await signInRes.json()

  const cookieStore = await cookies()
  cookieStore.set(
    COOKIE_NAME,
    JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }
  )

  return { redirectTo: '/onboarding' }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/login')
}
