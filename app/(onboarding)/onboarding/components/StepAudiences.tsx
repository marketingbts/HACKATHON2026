import { useState } from 'react'
import { InputField } from '@/components/ui/InputField'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export type AudienceFormData = {
  name: string
  description: string
}

type StepAudiencesProps = {
  audiences: AudienceFormData[]
  onAddAudience: (audience: AudienceFormData) => void
  onRemoveAudience: (index: number) => void
  onBack: () => void
  onNext: () => void
}

export function StepAudiences({ audiences, onAddAudience, onRemoveAudience, onBack, onNext }: StepAudiencesProps) {
  const [mode, setMode] = useState<'form' | 'list'>(audiences.length === 0 ? 'form' : 'list')
  const [form, setForm] = useState<AudienceFormData>({ name: '', description: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSave() {
    if (!form.name.trim()) {
      setErrors({ name: 'Ingresá una descripción de la audiencia' })
      return
    }
    onAddAudience({ name: form.name.trim(), description: form.description.trim() })
    setForm({ name: '', description: '' })
    setErrors({})
    setMode('list')
  }

  function handleAddAnother() {
    setForm({ name: '', description: '' })
    setErrors({})
    setMode('form')
  }

  const header = (
    <div className="text-center mb-5">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">Paso 2 de 3</p>
      <h2 className="text-2xl font-bold text-gray-900">¿A quién le hablás?</h2>
      <p className="text-gray-500 text-sm mt-1">Podés definir varios perfiles de audiencia para tu marca.</p>
    </div>
  )

  if (mode === 'form') {
    return (
      <div className="flex flex-col gap-5">
        {header}

        <InputField
          id="audience-name"
          label="Audiencia principal"
          placeholder="Ej: Madres de familia del barrio, 30-50 años"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={errors.name ? 'border-red-400' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs -mt-3">{errors.name}</p>}

        <Textarea
          id="audience-description"
          label="¿Qué problema les resolvés?"
          placeholder="Ej: Tienen poco tiempo y quieren desayunos ricos y caseros sin cocinar"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex items-center justify-between pt-2">
          <Button variant="link" onClick={onBack}>
            ← Atrás
          </Button>
          <Button onClick={handleSave}>
            Continuar →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {header}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Audiencias definidas</p>
        <div className="flex flex-col gap-2">
          {audiences.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-gray-800 truncate">{a.name}</span>
                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <button
                onClick={() => onRemoveAudience(i)}
                className="text-gray-400 hover:text-red-400 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {audiences.length < 5 && (
          <button
            onClick={handleAddAnother}
            className="w-full mt-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-500 hover:text-indigo-700 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Agregar otra audiencia
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="link" onClick={onBack}>
          ← Atrás
        </Button>
        <Button onClick={onNext}>
          Continuar →
        </Button>
      </div>
    </div>
  )
}
