'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type SelectOption = { value: string; label: string }

type SelectProps = {
  id: string
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  wrapperClassName?: string
}

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccioná una opción',
  wrapperClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(option: SelectOption) {
    onChange?.(option.value)
    setOpen(false)
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('flex w-full flex-col items-start gap-2', wrapperClassName)}
    >
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="font-medium text-sm text-neutral-ui-label"
      >
        {label}
      </label>

      {/* Trigger */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative flex h-select w-full items-center justify-between px-4 py-3 rounded-lg',
          'text-sm font-normal',
          'transition-colors duration-150 focus:outline-none',
          open
            ? 'bg-surface-white border-2 border-brand-500'
            : selected
              ? 'bg-surface-white border border-border-input hover:border-[#c7c9e0]'
              : 'bg-surface-input border border-border-input hover:border-[#c7c9e0]',
          selected ? 'text-brand-900' : 'text-neutral-ui-placeholder',
        )}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            'shrink-0 text-neutral-ui-placeholder transition-transform duration-200',
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
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="w-full overflow-hidden rounded-[16px] border border-border-input bg-surface-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option)}
              className={cn(
                'cursor-pointer px-4 py-2.5 text-sm font-normal transition-colors duration-100',
                option.value === value
                  ? 'bg-surface-primary-subtle text-brand-900'
                  : 'text-neutral-950 hover:bg-surface-primary-subtle active:bg-surface-primary-faded',
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
