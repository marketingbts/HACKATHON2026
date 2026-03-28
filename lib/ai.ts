// Capa de abstracción de IA — el proveedor se configura con AI_PROVIDER

export async function generateContent(prompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'groq'

  if (provider === 'groq') return callGroq(prompt)
  if (provider === 'openai') return callOpenAI(prompt)
  if (provider === 'gemini') return callGemini(prompt)

  throw new Error(`Proveedor de IA no soportado: ${provider}`)
}

async function callGroq(prompt: string): Promise<string> {
  // TODO: implementar con groq-sdk
  // const Groq = require('groq-sdk')
  // const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  // const completion = await client.chat.completions.create({
  //   model: 'llama-3.3-70b-versatile',
  //   response_format: { type: 'json_object' },
  //   messages: [{ role: 'user', content: prompt }],
  //   temperature: 0.8,
  // })
  // return completion.choices[0].message.content!
  throw new Error('Groq no implementado aún')
}

async function callOpenAI(prompt: string): Promise<string> {
  // TODO: implementar con openai sdk
  throw new Error('OpenAI no implementado aún')
}

async function callGemini(prompt: string): Promise<string> {
  // TODO: implementar con Google Gemini
  throw new Error('Gemini no implementado aún')
}
