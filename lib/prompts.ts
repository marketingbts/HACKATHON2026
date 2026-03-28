import type { BuildQuickPromptParams, BuildPlanPromptParams, Business, Product } from './types'

function buildBusinessContext(
  business: Business,
  products: Product[]
): object {
  return {
    business_context: {
      name: business.name,
      category: business.industry,
      description: business.description,
      products: products.map(p => p.name)
    }
  }
}

function buildStrategyContext(
  objective: string,
  audienceName: string,
  tone: string,
  period: string,
): object {
  return {
    strategy: {
      objective,
      audienceName,
      tone,
      period,
    }
  }
}

export function buildQuickPrompt(params: BuildQuickPromptParams): string {
  const context = buildBusinessContext(params.business, params.products)

  return `
    Eres un experto en marketing de contenidos para redes sociales en Latinoamérica.
    Trabajás con emprendedores y pymes. Tu tono es práctico y orientado a resultados.

    ${JSON.stringify(context, null, 2)}

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

function buildAssistantContext(params: BuildPlanPromptParams): string {
  return JSON.stringify({
    ...buildBusinessContext(params.business, params.products),
    ...buildStrategyContext(
      params.objective,
      params.audienceName,
      params.tone,
      params.period,
    )
  })
}

export function buildPlanPrompt(params: BuildPlanPromptParams): object {
  
  return {
    "model": "openai/gpt-oss-120b",
    "temperature": 0.35,
    "top_p": 1,
    "max_completion_tokens": 4000,
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "content_plan",
        "schema": {
          "type": "object",
          "required": ["strategy_summary", "posts", "recommended_actions", "calendar"],
          "properties": {
            "strategy_summary": {
              "type": "object",
              "required": ["approach", "content_focus", "timeline_explanation"],
              "properties": {
                "approach": { "type": "string" },
                "content_focus": { "type": "string" },
                "timeline_explanation": { "type": "string" }
              }
            },
            "posts": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["day", "type", "goal", "copies"],
                "properties": {
                  "day": { "type": "string" },
                  "type": { "type": "string", "enum": ["post", "reel", "story", "carousel"] },
                  "goal": { "type": "string" },
                  "copies": {
                    "type": "array",
                    "minItems": 3,
                    "maxItems": 3,
                    "items": {
                      "type": "object",
                      "required": ["text", "visual_description"],
                      "properties": {
                        "text": { "type": "string" },
                        "visual_description": { "type": "string" }
                      }
                    }
                  }
                }
              }
            },
            "recommended_actions": {
              "type": "array",
              "items": { "type": "string" }
            },
            "calendar": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["day", "action", "type", "goal", "suggested_time"],
                "properties": {
                  "day": { "type": "string" },
                  "action": { "type": "string" },
                  "type": { "type": "string", "enum": ["publication", "action"] },
                  "goal": { "type": "string" },
                  "suggested_time": { "type": "string" }
                }
              }
            }
          }
        }
      }
    },
    "messages": [
      {
        "role": "system",
        "content": "Sos un experto en marketing digital especializado en Instagram para emprendedores y pymes de Argentina.\n\nTu tarea es generar un PLAN DE CONTENIDO ESTRATÉGICO completamente personalizado en base al contexto del negocio y las características de la estrategia definidas por el usuario.\n\n REGLAS GENERALES:\n- Escribí TODO en español simple, claro y accionable\n- No uses lenguaje técnico innecesario\n- No des consejos genéricos\n- Todo debe estar adaptado al negocio\n- Pensá como community manager real del negocio\n- NO agregues texto fuera del JSON\n- RESPONDÉ ÚNICAMENTE EN JSON VÁLIDO\n\n## 📏 DEFINICIÓN DE CANTIDAD DE PUBLICACIONES\n- day → EXACTAMENTE 1 publicación\n- week → entre 3 y 5 publicaciones\n- month → entre 10 y 15 publicaciones\n\n## LÓGICA SEGÚN OBJETIVO\n- launch_product: anticipación + lanzamiento + prueba social\n- gain_followers: contenido atractivo, compartible y de descubrimiento\n- increase_engagement: interacción directa, preguntas, comunidad\n- promote_offer: beneficio, urgencia, CTA\n- retain_customers: fidelización, cercanía\n\n## CÓMO FUNCIONA INSTAGRAM\n- Prioridad: guardados, compartidos, comentarios\n- Reels tienen mayor alcance\n- Stories generan cercanía diaria\n- Evitar contenido promocional sin valor\n\n## HOOKS\nUsar curiosidad, historia, valor directo y contrarias según corresponda.\n\nRecordá: SOLO JSON válido."
      },
      {
        "role": "user",
        "content": buildAssistantContext(params)
      }
      
    ] 
  }
}
