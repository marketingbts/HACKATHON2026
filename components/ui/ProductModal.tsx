'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { InputField } from './InputField'
import { Textarea } from './Textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type ProductModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (productId: string) => void
  initialName?: string
}

export function ProductModal({ isOpen, onClose, onSuccess, initialName = '' }: ProductModalProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState('')
  const [differentiator, setDifferentiator] = useState('')
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, differentiator }),
      })
      if (!res.ok) throw new Error('Error al crear producto')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onSuccess?.(data.id)
      onClose()
      reset()
    },
  })

  function reset() {
    setName('')
    setDescription('')
    setDifferentiator('')
  }

  function handleSubmit() {
    if (!name.trim()) return
    createProduct.mutate()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Producto o Servicio"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={createProduct.isPending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={createProduct.isPending || !name.trim()}>
            {createProduct.isPending ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <InputField
          id="prod-name"
          label="Nombre del producto o servicio"
          placeholder="Ej: Pan de masa madre, Consultoría IT, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          id="prod-desc"
          label="¿De qué se trata?"
          placeholder="Describe brevemente lo que ofreces"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <InputField
          id="prod-diff"
          label="¿Qué lo hace único?"
          placeholder="Ej: Hecho a mano, entrega en el día, el más barato"
          value={differentiator}
          onChange={(e) => setDifferentiator(e.target.value)}
        />
      </div>
    </Modal>
  )
}