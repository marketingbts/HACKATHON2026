type StepIndicatorProps = {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((_, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep

        return (
          <div key={i} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isCompleted
                  ? 'bg-semantic-success-alt text-white'
                  : isActive
                  ? 'bg-brand text-white'
                  : 'bg-surface-primary-wash text-brand-350'
              }`}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${i < currentStep ? 'bg-semantic-success-alt' : 'bg-surface-primary-wash'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
