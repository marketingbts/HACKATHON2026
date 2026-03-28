import type { BuildQuickPromptParams, BuildPlanPromptParams, Business, Audience, Product } from './types'

function buildBusinessContext(
  business: Business,
  audiences: Audience[],
  products: Product[]
): string {
  return `
## Negocio
Nombre: ${business.name}
Rubro: ${business.industry}
Descripción: ${business.description}
Redes sociales activas: ${business.socialNetworks.join(', ')}
${business.colors ? `Colores de marca: ${business.colors}` : ''}

## Audiencias
${audiences.map((a) => `
- Nombre: ${a.name}
  Descripción: ${a.description ?? ''}
  Rango etario: ${a.ageRange ?? 'no especificado'}
  Intereses: ${a.interests ?? 'no especificados'}
  Redes preferidas: ${a.networks.join(', ')}
  Ubicación: ${a.location ?? 'no especificada'}
`).join('\n')}

## Productos/Servicios
${products.map((p) => `
- Nombre: ${p.name}
  Descripción: ${p.description ?? ''}
  Diferencial: ${p.differentiator ?? ''}
`).join('\n')}
`.trim()
}

export function buildQuickPrompt(params: BuildQuickPromptParams): string {
  const context = buildBusinessContext(params.business, params.audiences, params.products)

  return `
Eres un experto en marketing de contenidos para redes sociales en Latinoamérica.
Trabajás con emprendedores y pymes. Tu tono es práctico y orientado a resultados.

${context}

## Tarea
Generá 3 variantes de copy para un post en redes sociales:
- Formato: ${params.format}
${params.productName ? `- Producto a destacar: ${params.productName}` : ''}
${params.audienceName ? `- Audiencia objetivo: ${params.audienceName}` : ''}
${params.detail ? `- Instrucción adicional: ${params.detail}` : ''}

## Reglas
- Cada variante debe tener un enfoque distinto (emocional, racional, urgencia)
- Incluí hashtags relevantes en cada variante
- Copy listo para publicar, en español rioplatense
- La sugerencia de imagen debe ser descriptiva (1-2 oraciones)

## Respuesta (JSON estricto)
{
  "variants": [
    { "variant": 1, "copy": "...", "imageSuggestion": "..." },
    { "variant": 2, "copy": "...", "imageSuggestion": "..." },
    { "variant": 3, "copy": "...", "imageSuggestion": "..." }
  ]
}
`.trim()
}

export function buildPlanPrompt(params: BuildPlanPromptParams): string {
  const context = buildBusinessContext(params.business, params.audiences, params.products)

  return `
Eres un estratega de contenidos digitales especializado en pymes latinoamericanas.

${context}

## Tarea
Creá un plan de contenido completo:
- Objetivo: ${params.objective}
${params.audienceName ? `- Audiencia principal: ${params.audienceName}` : ''}
- Tono de comunicación: ${params.tone}
- Período: ${params.periodStart} al ${params.periodEnd}

## Reglas
- Distribuí los posts uniformemente en el período
- Variá los formatos (carrusel, reel, imagen estática, story)
- Cada post debe tener 3 variantes con enfoques distintos
- Fechas en formato YYYY-MM-DD
- Todo en español rioplatense

## Respuesta (JSON estricto)
{
  "strategySummary": "resumen de 2-3 párrafos",
  "recommendedActions": ["acción 1", "acción 2"],
  "posts": [
    {
      "scheduledDate": "YYYY-MM-DD",
      "network": "instagram",
      "format": "post",
      "variants": [
        { "variant": 1, "copy": "...", "imageSuggestion": "..." },
        { "variant": 2, "copy": "...", "imageSuggestion": "..." },
        { "variant": 3, "copy": "...", "imageSuggestion": "..." }
      ]
    }
  ]
}
`.trim()
}
