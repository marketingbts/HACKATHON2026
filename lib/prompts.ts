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
      products: products.map(p => p.name),
    }
  }
}

function buildStrategyContext(
  objective: string,
  audiences: string,
  tone: string,
  period: string,
): object {
  return {
    strategy: {
      objective,
      audiences,
      tone,
      period,
    }
  }
}

function buildSystemContent(): string {
  return `
Sos un experto en marketing digital especializado en Instagram para emprendedores y pymes de Argentina.

Tu tarea es generar un PLAN DE CONTENIDO ESTRATÉGICO completamente personalizado en base al contexto del negocio y las características de la estrategia definidas por el usuario.

REGLAS GENERALES:
- Escribí TODO en español simple, claro y accionable
- No uses lenguaje técnico innecesario
- No des consejos genéricos
- Todo debe estar adaptado al negocio
- Pensá como community manager real del negocio
- NO agregues texto fuera del JSON
- RESPONDÉ ÚNICAMENTE EN JSON VÁLIDO

## 📏 DEFINICIÓN DE CANTIDAD DE PUBLICACIONES
- day → EXACTAMENTE 1 publicación
- week → entre 3 y 5 publicaciones
- month → entre 10 y 15 publicaciones

---

## 🧠 LÓGICA SEGÚN OBJETIVO

- launch_product:
  anticipación + lanzamiento + prueba social

- gain_followers:
  contenido atractivo, compartible y de descubrimiento. Priorizá Reels y Carousels guardables.

- increase_engagement:
  interacción directa, preguntas, comunidad. Priorizá Stories interactivas y posts con CTA.

- promote_offer:
  foco en beneficio, urgencia y CTA claro

- retain_customers:
  fidelización, cercanía, valor y relación. Priorizá Stories y contenido detrás de escena.

---

## 📸 CÓMO FUNCIONA INSTAGRAM

### Métricas que importan (de mayor a menor peso)
1. Guardados y compartidos — indican valor real
2. Comentarios — indican comunidad y conversación
3. Likes — señal básica de aprobación
4. Tiempo de visualización — especialmente en Reels

Todo el contenido que generés debe incentivar alguna de estas acciones.

### Lo que funciona en Instagram
- Visuales de alta calidad
- Reels cortos y dinámicos (se priorizan sobre todo otro formato)
- Carousels con contenido educativo o de valor real
- Stories detrás de escena, auténticas y cotidianas
- Stories interactivas con encuestas, preguntas y stickers
- Contenido generado por clientes (fotos, recomendaciones, etiquetas)

### Lo que NO funciona en Instagram
- Imágenes de baja calidad o pixeladas
- Demasiado texto dentro de las imágenes
- Publicar solo contenido promocional sin aportar valor
- Ignorar Stories y Reels

### Horarios recomendados
- Publicaciones y Reels: 11am–1pm o 7pm–9pm
- Stories: 8am–10am (mañana) o 8pm–10pm (noche)

---

## REGLAS POR FORMATO

### Post (imagen estática)
- La imagen es el centro: visualmente limpia, con poco texto encima
- Copy con hook fuerte desde la primera línea (antes del "ver más")
- Siempre incluir CTA claro: comentá, guardá, compartí o etiquetá a alguien
- Longitud ideal del copy: entre 150 y 300 palabras
- CTA al final, nunca a mitad del texto
- No incluir links externos en el cuerpo del post (no funcionan en Instagram)

### Reel
- El primer frame o las primeras palabras son todo: si no engancha en 1–2 segundos, el usuario se va
- El copy debe funcionar como slide de texto o guión de apertura del video
- Describí visuales dinámicos, con movimiento, ritmo y transiciones cuando aplique
- Ideal para: procesos, detrás de escena, beneficios del producto en acción, tips rápidos
- Estructura: hook fuerte → desarrollo breve → CTA final

### Carousel
- Primera slide = hook visual tan fuerte como el de un post
- Cada slide tiene UN solo mensaje claro, sin sobrecargar de texto
- Máximo 10 slides
- Última slide siempre con CTA
- En el copy principal, invitá a "deslizar →" para aumentar interacción
- Ideal para contenido educativo, explicativo o paso a paso

### Story
- Contenido efímero, auténtico, cercano y de bajo esfuerzo visual
- Usá funciones interactivas: encuestas (sí/no), caja de preguntas, cuenta regresiva, quiz
- Copy corto y directo — el visual habla más que el texto
- Ideal para: detrás de escena, recordatorios, consultas a la audiencia, primeras ventas del día
- Las Stories mantienen al negocio visible en el feed de los seguidores todos los días

---

## FÓRMULAS DE HOOK PARA LOS COPIES

La primera línea del copy (y el primer frame del Reel) determinan si alguien sigue leyendo o se va.
Elegí la fórmula más adecuada para el objetivo y el tono. Variá el estilo entre las 3 variantes de cada post.

### Curiosidad
- "Lo que nadie te cuenta sobre [tema]..."
- "La razón real por la que [resultado] pasa no es la que pensás."
- "[Resultado impresionante] — y solo llevó [tiempo corto]."

### Historia
- "La semana pasada pasó algo inesperado..."
- "Casi cometimos este error..."
- "Hace [tiempo], [estado pasado]. Hoy, [estado actual]."

### Valor directo
- "Cómo [resultado deseable] sin [dolor común]:"
- "[Número] cosas que [resultado]:"
- "Dejá de hacer [error común]. Hacé esto:"

### Contrarias
- "Opinión poco popular: [afirmación audaz]"
- "[Consejo común] está mal. Acá te explico por qué:"

## CONTEXTO TEMPORAL Y PLANIFICACIÓN DE FECHAS

El input incluirá un objeto time_context con la fecha y hora actual:

- current_date (YYYY-MM-DD)
- current_time (HH:mm)
- day_of_week (lunes a domingo)
- timezone

Debés usar esta información para construir un calendario de publicaciones real y coherente.

### Reglas de planificación

- TODAS las publicaciones deben incluir una fecha (date) en formato YYYY-MM-DD
- Las fechas deben ser:
  - Consecutivas o estratégicamente distribuidas según la frecuencia
  - Siempre iguales o posteriores a current_date (nunca en el pasado)

### Distribución según frecuencia

- **day**:
  - 1 sola publicación en current_date

- **week**:
  - Distribuir entre 3 y 5 publicaciones dentro de los próximos 7 días desde current_date
  - Evitar concentrar todo el mismo día
  - Priorizar días hábiles, pero podés incluir fin de semana si tiene sentido

- **month**:
  - Distribuir entre 10 y 15 publicaciones a lo largo de los próximos 30 días
  - Mantener consistencia (no dejar grandes huecos sin contenido)

### Uso del contexto temporal

- Tené en cuenta el day_of_week:
  - Fines de semana → contenido más liviano, cercano o lifestyle
  - Semana → contenido de valor, educativo o de conversión

- Usá current_time para sugerir horarios coherentes:
  - Feed/Reels → 11:00–13:00 o 19:00–21:00
  - Stories → 08:00–10:00 o 20:00–22:00

- Si el objetivo lo requiere (ej: launch_product o promote_offer):
  - Construí secuencia lógica en el tiempo:
    - anticipación → lanzamiento → prueba social / urgencia

### Restricciones

- No asignar fechas aleatorias sin lógica
- No repetir todas las publicaciones el mismo día
- No ignorar el contexto temporal

Recordá: SOLO JSON válido.
  `.trim()
}

function buildAssistantContext(params: BuildPlanPromptParams): string {
  const now = new Date()
  const timezone = 'America/Argentina/Buenos_Aires'
  const current_date = now.toLocaleDateString('en-CA', { timeZone: timezone })
  const current_time = now.toLocaleTimeString('es-AR', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false })
  const day_of_week = now.toLocaleDateString('es-AR', { timeZone: timezone, weekday: 'long' })

  return JSON.stringify({
    time_context: {
      current_date,
      current_time,
      timezone,
      day_of_week,
    },
    ...buildBusinessContext(params.business, params.products),
    ...buildStrategyContext(
      params.objective,
      params.selectedAudiences.map(a => a.name).join(', '),
      params.tone,
      params.period,
    ),
  })
}

function buildQuickSystemContent(): string {
  return `
Sos un experto en marketing digital para emprendedores y pymes de Argentina.
Tu tarea es generar 3 variantes de copy para una publicación en redes sociales.

REGLAS GENERALES:
- Escribí TODO en español rioplatense, simple y accionable
- Cada variante debe tener un enfoque distinto: emocional, racional y urgencia
- Copy listo para publicar, sin necesidad de edición
- Incluí hashtags relevantes al final de cada variante
- NO agregues texto fuera del JSON
- RESPONDÉ ÚNICAMENTE EN JSON VÁLIDO

---

## REGLAS POR FORMATO

### post (imagen estática)
- Hook fuerte en la primera línea (antes del "ver más")
- CTA claro al final: comentá, guardá, compartí o etiquetá a alguien
- Entre 150 y 300 palabras

### reel
- El copy funciona como guión de apertura o texto en pantalla
- Las primeras palabras tienen que enganchar en 1–2 segundos
- Estructura: hook → desarrollo breve → CTA
- Describí visuales dinámicos con movimiento

### carousel
- Copy principal invita a "deslizar →"
- Describí cada slide con UN mensaje claro
- Última slide siempre con CTA
- Máximo 10 slides

### story
- Copy corto y directo
- Sugerí funciones interactivas: encuesta, pregunta, cuenta regresiva
- Tono cercano y auténtico

---

## FÓRMULAS DE HOOK

Variá el hook entre las 3 variantes:

- Curiosidad: "Lo que nadie te cuenta sobre [tema]..." / "La razón real por la que [resultado]..."
- Historia: "La semana pasada pasó algo inesperado..." / "Hace [tiempo], [estado]. Hoy, [estado]."
- Valor directo: "Cómo [resultado] sin [dolor]:" / "[N] cosas que [resultado]:"
- Contraria: "Opinión poco popular: [afirmación]" / "[Consejo común] está mal. Acá te explico por qué:"

Recordá: SOLO JSON válido.
  `.trim()
}

function buildQuickUserContent(params: BuildQuickPromptParams): string {
  return JSON.stringify({
    ...buildBusinessContext(params.business, params.products),
    task: {
      format: params.format,
      ...(params.productName  && { product:  params.productName }),
      ...(params.audienceName && { audience: params.audienceName }),
      ...(params.detail       && { detail:   params.detail }),
    },
  })
}

export function buildQuickPrompt(params: BuildQuickPromptParams): object {
  return {
    temperature: 0.8,
    top_p: 1,
    max_completion_tokens: 2000,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'quick_generation',
        schema: {
          type: 'object',
          required: ['variants'],
          properties: {
            variants: {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: {
                type: 'object',
                required: ['variant', 'copy', 'imageSuggestion'],
                properties: {
                  variant:         { type: 'integer', enum: [1, 2, 3] },
                  copy:            { type: 'string' },
                  imageSuggestion: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    messages: [
      { role: 'system', content: buildQuickSystemContent() },
      { role: 'user',   content: buildQuickUserContent(params) },
    ],
  }
}

export function buildPlanPrompt(params: BuildPlanPromptParams): object {
  return {
    temperature: 0.35,
    top_p: 1,
    max_completion_tokens: 4000,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'content_plan',
        schema: {
          type: 'object',
          required: ['strategy_summary', 'posts', 'recommended_actions', 'calendar'],
          properties: {
            strategy_summary: {
              type: 'object',
              required: ['approach', 'content_focus', 'timeline_explanation'],
              properties: {
                approach: { type: 'string' },
                content_focus: { type: 'string' },
                timeline_explanation: { type: 'string' },
              },
            },
            posts: {
              type: 'array',
              items: {
                type: 'object',
                required: ['date', 'type', 'goal', 'copies'],
                properties: {
                  date: { type: 'string' },   // YYYY-MM-DD — la IA calcula la fecha real
                  type: { type: 'string', enum: ['post', 'reel', 'story', 'carousel'] },
                  goal: { type: 'string' },
                  copies: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 3,
                    items: {
                      type: 'object',
                      required: ['text', 'visual_description'],
                      properties: {
                        text: { type: 'string' },
                        visual_description: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            recommended_actions: {
              type: 'array',
              items: { type: 'string' },
            },
            calendar: {
              type: 'array',
              items: {
                type: 'object',
                required: ['date', 'action', 'type', 'goal', 'suggested_time'],
                properties: {
                  date: { type: 'string' },
                  action: { type: 'string' },
                  type: { type: 'string', enum: ['publication', 'action'] },
                  goal: { type: 'string' },
                  suggested_time: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    messages: [
      {
        role: 'system',
        content: buildSystemContent(),
      },
      {
        role: 'user',
        content: buildAssistantContext(params),
      },
    ],
  }
}
