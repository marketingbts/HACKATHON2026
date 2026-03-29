export type BusinessFormData = {
  name: string
  industry: string
  description: string
}

type StepBusinessProps = {
  data: BusinessFormData
  errors: Record<string, string>
  onChange: (data: BusinessFormData) => void
  onNext: () => void
}

export function StepBusiness({ data, errors, onChange, onNext }: StepBusinessProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">Paso 1 de 3</p>
        <h2 className="text-2xl font-bold text-gray-900">¿Quién sos?</h2>
        <p className="text-gray-500 text-sm mt-1">Contanos sobre tu negocio para personalizar el contenido.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del negocio</label>
        <input
          className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? 'border-red-400' : ''}`}
          placeholder="Ej: La Esquina de María"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Rubro</label>
        <input
          className={`w-full border rounded px-3 py-2 text-sm ${errors.industry ? 'border-red-400' : ''}`}
          placeholder="Ej: Panadería artesanal"
          value={data.industry}
          onChange={(e) => onChange({ ...data, industry: e.target.value })}
        />
        {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué hace especial a tu negocio?</label>
        <textarea
          className={`w-full border rounded px-3 py-2 text-sm resize-none ${errors.description ? 'border-red-400' : ''}`}
          rows={3}
          placeholder="Ej: Hacemos pan de masa madre con receta familiar, sin conservantes"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <button
        onClick={onNext}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-colors mt-2"
      >
        Continuar
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
