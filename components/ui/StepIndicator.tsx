import { cn } from '@/lib/utils'

type StepIndicatorProps = {
  currentStep: number
  totalSteps: number
  className?: string
}

type StepState = 'active' | 'next' | 'success'

function getStepState(step: number, currentStep: number): StepState {
  if (step < currentStep) return 'success'
  if (step === currentStep) return 'active'
  return 'next'
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 8.5L6 12L13.5 4.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <nav aria-label="Progreso del formulario" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const state = getStepState(step, currentStep)
          const isLast = index === steps.length - 1

          return (
            <li key={step} className="flex items-center">
              {/* Círculo 40×40px */}
              <div
                aria-label={`Paso ${step} de ${totalSteps}: ${
                  state === 'success'
                    ? 'completado'
                    : state === 'active'
                      ? 'actual'
                      : 'pendiente'
                }`}
                aria-current={state === 'active' ? 'step' : undefined}
                style={
                  state === 'success'
                    ? { backgroundColor: '#16a34a' }
                    : undefined
                }
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  'transition-all duration-200',
                  state === 'active' && 'bg-brand shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
                  state === 'next'   && 'bg-surface-primary-faded',
                  state === 'success' && 'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
                )}
              >
                {state === 'success' ? (
                  <CheckIcon />
                ) : (
                  <span
                    className={cn(
                      'font-bold text-sm',
                      state === 'active' && 'text-surface-background',
                      state === 'next'   && 'text-neutral-ui-step-inactive',
                    )}
                  >
                    {step}
                  </span>
                )}
              </div>

              {/* Conector 32×2px — verde si el paso a su izquierda está completado */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={state === 'success' ? { backgroundColor: '#16a34a' } : undefined}
                  className={cn(
                    'h-0.5 w-8 rounded-sm',
                    'transition-colors duration-200 delay-75',
                    state !== 'success' && 'bg-border-default',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
