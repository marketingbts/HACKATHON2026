import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ error: 'El prompt no puede estar vacío' }, { status: 400 })
    }

    const token = process.env.HF_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'HF_TOKEN no configurado' }, { status: 500 })
    }

    const hfResponse = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt.trim() }),
      },
    )

    if (hfResponse.status === 503) {
      return NextResponse.json(
        { error: 'El modelo está cargando, reintenta en unos segundos' },
        { status: 503 },
      )
    }

    if (!hfResponse.ok) {
      const errText = await hfResponse.text()
      return NextResponse.json(
        { error: `Error de Hugging Face: ${errText}` },
        { status: hfResponse.status },
      )
    }

    const buffer = await hfResponse.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64}`

    return NextResponse.json({ image: dataUrl })
  } catch (err) {
    console.error('[generate/image]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
