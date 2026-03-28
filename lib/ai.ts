import Groq from 'groq-sdk'
import type { ChatCompletion } from 'groq-sdk/resources/chat/completions'

// ─── Para cambiar de proveedor, solo modificar AI_PROVIDER en .env ────────────
//
//   AI_PROVIDER=groq    → Groq (default, más rápido)
//   AI_PROVIDER=openai  → OpenAI — instalar: npm i openai
//   AI_PROVIDER=gemini  → Google Gemini — instalar: npm i @google/generative-ai
//
// Todas las funciones públicas son independientes del proveedor.

// ─── Clientes (se instancian solo si se usan) ──────────────────────────────────

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

// ─── Generación rápida ─────────────────────────────────────────────────────────
// Recibe un prompt string, devuelve JSON string.
// Usado por /api/generate/quick

export async function generateContent(prompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'groq'

  if (provider === 'groq')   return callGroq(prompt)
  if (provider === 'openai') return callOpenAI(prompt)
  if (provider === 'gemini') return callGemini(prompt)

  throw new Error(`Proveedor de IA no soportado: ${provider}`)
}

async function callGroq(prompt: string): Promise<string> {
  const groq = getGroqClient()
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    response_format: { type: 'json_object' },
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  })
  return completion.choices[0].message.content ?? ''
}

async function callOpenAI(_prompt: string): Promise<string> {
  // npm i openai
  // const { default: OpenAI } = await import('openai')
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const completion = await client.chat.completions.create({
  //   model: 'gpt-4o',
  //   response_format: { type: 'json_object' },
  //   temperature: 0.8,
  //   messages: [{ role: 'user', content: prompt }],
  // })
  // return completion.choices[0].message.content ?? ''
  throw new Error('OpenAI no configurado. Instalá el SDK: npm i openai')
}

async function callGemini(_prompt: string): Promise<string> {
  // npm i @google/generative-ai
  // const { GoogleGenerativeAI } = await import('@google/generative-ai')
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  // const result = await model.generateContent(prompt)
  // return result.response.text()
  throw new Error('Gemini no configurado. Instalá el SDK: npm i @google/generative-ai')
}

// ─── Generación de plan ────────────────────────────────────────────────────────
// Recibe el request body completo construido por buildPlanPrompt().
// Usado por /api/generate/plan

export async function generatePlanContent(requestBody: object): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'groq'

  if (provider === 'groq')   return callGroqWithSchema(requestBody)
  if (provider === 'openai') return callOpenAIWithSchema(requestBody)
  if (provider === 'gemini') return callGeminiWithSchema(requestBody)

  throw new Error(`Proveedor de IA no soportado: ${provider}`)
}

async function callGroqWithSchema(requestBody: object): Promise<string> {
  const groq = getGroqClient()
  const body = { ...requestBody, model: 'openai/gpt-oss-120b' }
  const completion = await groq.chat.completions.create(
    body as Parameters<typeof groq.chat.completions.create>[0]
  ) as ChatCompletion
  return completion.choices[0].message.content ?? ''
}

async function callOpenAIWithSchema(_requestBody: object): Promise<string> {
  // npm i openai
  // const { default: OpenAI } = await import('openai')
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const body = { ...requestBody, model: 'gpt-4o' }
  // const completion = await client.chat.completions.create(body as any)
  // return completion.choices[0].message.content ?? ''
  throw new Error('OpenAI no configurado. Instalá el SDK: npm i openai')
}

async function callGeminiWithSchema(_requestBody: object): Promise<string> {
  // Gemini usa una API distinta — hay que adaptar el requestBody al formato de Gemini.
  // Ver: https://ai.google.dev/api/generate-content
  throw new Error('Gemini no configurado. Instalá el SDK: npm i @google/generative-ai')
}
