'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { registerAction } from '../actions'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="primary" disabled={pending} className="w-full">
      {pending ? 'Creando cuenta...' : 'Crear cuenta'}
    </Button>
  )
}

function PasswordField({ id, name, label, placeholder }: { id: string; name: string; label: string; placeholder: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <label htmlFor={id} className="font-medium text-sm text-neutral-ui-label">{label}</label>
      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          required
          placeholder={placeholder}
          className={cn(
            'w-full h-input px-4 py-3.5 pr-11',
            'bg-surface-input border border-border-input rounded-lg',
            'text-sm font-normal text-brand-900',
            'placeholder:text-neutral-ui-placeholder placeholder:font-normal',
            'transition-colors duration-150',
            'hover:border-[#c7c9e0]',
            'focus:outline-none focus:border-2 focus:border-brand-500',
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show
            ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
        </button>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  const router = useRouter()
  const [state, action] = useFormState(registerAction, {})

  useEffect(() => {
    if (state.redirectTo) router.push(state.redirectTo)
  }, [state, router])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-neutral-900">Creá tu cuenta</h2>
      <form action={action} className="flex flex-col gap-4">
        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          placeholder="tu@email.com"
        />
        <PasswordField id="password" name="password" label="Contraseña" placeholder="••••••••" />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirmar contraseña" placeholder="••••••••" />
        <div className="pt-1 flex justify-center">
          <SubmitButton />
        </div>
      </form>
      <p className="text-center text-sm mt-5 text-neutral-500">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-brand font-medium hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
