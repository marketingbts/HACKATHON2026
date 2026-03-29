'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { InputField } from './InputField'
import { Textarea } from './Textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type AudienceModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (audienceId: string) => void
  initialName?: string
}

export function AudienceModal({ isOpen, onClose, onSuccess, initialName = '' }: AudienceModalProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [interests, setInterests] = useState('')
  const [behavior, setBehavior] = useState('')
  const [location, setLocation] = useState('')
  const queryClient = useQueryClient()

  const createAudience = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/audiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, ageRange, interests, behavior, location }),
      })
      if (!res.ok) throw new Error('Error al crear audiencia')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      onSuccess?.(data.id)
      onClose()
      reset()
    },
  })

  function reset() {
    setName('')
    setDescription('')
    setAgeRange('')
    setInterests('')
    setBehavior('')
    setLocation('')
  }

  function handleSubmit() {
    if (!name.trim()) return
    createAudience.mutate()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Audiencia"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={createAudience.isPending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={createAudience.isPending || !name.trim()}>
            {createAudience.isPending ? 'Guardando...' : 'Guardar Audiencia'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <InputField
          id="aud-name"
          label="Nombre de la audiencia"
          placeholder="Ej: Madres del barrio, Gamers, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          id="aud-desc"
          label="¿Quiénes son?"
          placeholder="Describe a tu público objetivo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <InputField
          id="aud-age"
          label="Rango de edad"
          placeholder="Ej: 25-45 años"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />
        <InputField
          id="aud-loc"
          label="Ubicación"
          placeholder="Ej: Buenos Aires, CABA, Local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Textarea
          id="aud-interests"
          label="Intereses"
          placeholder="Ej: Cocina saludable, tecnología, viajes"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          rows={2}
        />
        <Textarea
          id="aud-behavior"
          label="Comportamiento"
          placeholder="Ej: Compra online los fines de semana"
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
          rows={2}
        />
      </div>
    </Modal>
  )
}