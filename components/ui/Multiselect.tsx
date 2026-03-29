'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type MultiselectProps = {
  id: string
  label: string
  options: Option[]
  value?: string[]
  onChange?: (values: string[]) => void
  onCreateNew?: (label: string) => void
  placeholder?: string
  wrapperClassName?: string
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-surface-primary-wash px-2.5 py-1 font-medium text-2xs text-neutral-900 transition-colors duration-100 hover:bg-surface-primary-faded">
      {label}
      <button
        type="button"
        aria-label={`Eliminar ${label}`}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="leading-none transition-colors duration-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500/50"
      >
        ×
      </button>
    </span>
  )
}

function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm',
        'transition-colors duration-150',
        checked
          ? 'bg-brand-600'
          : 'border-[1.5px] border-border-input bg-transparent hover:border-brand-500',
      )}
    >
      <span
        className={cn(
          'transition-transform duration-150',
          checked ? 'scale-100' : 'scale-0',
        )}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l2.5 2.5L10 3.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  )
}

export function Multiselect({
  id,
  label,
  options,
  value = [],
  onChange,
  onCreateNew,
  placeholder = 'Seleccioná opciones',
  wrapperClassName,
}: MultiselectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasValue = value.length > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOption(optionValue: string) {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange?.(next)
  }

  function removeChip(optionValue: string) {
    onChange?.(value.filter((v) => v !== optionValue))
  }

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedLabels = options.filter((o) => value.includes(o.value))

  return (
    <div
      ref={wrapperRef}
      className={cn('flex w-full flex-col items-start gap-2', wrapperClassName)}
    >
      <label
        id={`${id}-label`}
        className="font-medium text-sm text-neutral-ui-label"
      >
        {label}
      </label>

      {/* Trigger */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-multiselectable="true"
        aria-labelledby={`${id}-label`}
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((prev) => !prev)}
        className={cn(
          'flex min-h-select w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3',
          'text-sm font-normal transition-colors focus:outline-none',
          open
            ? 'border-2 border-brand-500 bg-surface-white'
            : hasValue
              ? 'border border-border-input bg-surface-white'
              : 'border border-border-input bg-surface-input',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {hasValue ? (
            selectedLabels.map((o) => (
              <Chip key={o.value} label={o.label} onRemove={() => removeChip(o.value)} />
            ))
          ) : (
            <span className="text-neutral-ui-placeholder">{placeholder}</span>
          )}
        </div>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            'ml-2 shrink-0 text-neutral-ui-placeholder transition-transform duration-200',
            open && 'rotate-180',
          )}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-multiselectable="true"
          className="w-full overflow-hidden rounded-[16px] border border-border-input bg-surface-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]"
        >
          {/* Search */}
          <li
            role="presentation"
            className="flex items-center gap-2 border-b border-border-input px-4 py-2.5"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0 text-neutral-ui-placeholder"
            >
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Buscar..."
              aria-label="Buscar opciones"
              className="flex-1 bg-transparent text-sm text-neutral-ui-placeholder placeholder:text-neutral-ui-placeholder focus:outline-none"
            />
          </li>

          {/* Crear nueva */}
          {onCreateNew && (
            <li
              role="presentation"
              onClick={(e) => {
                e.stopPropagation()
                onCreateNew(search)
                setSearch('')
              }}
              className="flex cursor-pointer items-center gap-1.5 border-b border-border-input px-4 py-2.5 text-sm font-medium text-brand hover:bg-surface-primary-subtle"
            >
              <span className="text-base leading-none">+</span>
              <span>Crear nueva</span>
            </li>
          )}

          {/* Opciones */}
          {filtered.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleOption(option.value)
                }}
                className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 transition-colors duration-100 hover:bg-surface-primary-subtle active:bg-surface-primary-faded"
              >
                <CustomCheckbox checked={isSelected} />
                <span
                  className={cn(
                    'text-sm font-normal',
                    isSelected ? 'text-brand-900' : 'text-neutral-950',
                  )}
                >
                  {option.label}
                </span>
              </li>
            )
          })}

          {filtered.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-neutral-ui-placeholder">
              Sin resultados
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
