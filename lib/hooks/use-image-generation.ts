'use client'

import { useState, useCallback, useRef } from 'react'

const IMAGE_GENERATION_ENDPOINT = '/api/generate/image'
const MAX_CONCURRENT_GENERATIONS = 6

interface UseImageGenerationResult {
  imageUrl: string | null
  loading: boolean
  error: string | null
  generateImage: (prompt: string) => Promise<void>
  reset: () => void
}

interface GenerateImageResponse {
  image?: string
  error?: string
}

// Cache en memoria por sesión: evita regenerar la misma imagen
const cache = new Map<string, string>()
const pending = new Map<string, Promise<string>>()
const queue: Array<() => void> = []

let activeGenerations = 0

function normalizePrompt(prompt: string): string {
  return prompt.trim()
}

function buildImagePrompt(prompt: string): string {
  return [
    `Primary scene: ${normalizePrompt(prompt)}`,
    '',
    'Generate one high-quality visual image only.',
    'Preserve the subject, atmosphere, composition, lighting, materials, and visual storytelling from the scene description.',
    'The image must communicate only through pure visuals.',
    'Interpret the input as a creative brief, not as literal layout instructions.',
    'Extract only the core visual idea of the post and ignore any request for written overlays, sticker elements, or engagement UI.',
    'If the input refers to a carousel, slides, portada, pages, panels, or multi-step content, still generate only a pure visual image with no text.',
    'If the brief mentions a sticker, interpret it only as a decorative visual shape or graphic accent, never as text, a label, or branded content.',
    '',
    'Absolute non-negotiable rule:',
    'The final image must contain zero text and zero logos.',
    '',
    'Strict negative constraints:',
    '- No words, letters, numbers, characters, glyphs, runes, symbols, captions, subtitles, handwriting, calligraphy, typography, or readable marks.',
    '- No fake text, pseudo-text, scrambled text, stylized text, typographic textures, letter-like strokes, or number-like shapes.',
    '- No logos, brand marks, trademarks, watermarks, signatures, stamps, seals, labels, emblems, mascots, monograms, initials, patches, badges, or branded iconography.',
    '- No packaging text, product labels, storefront names, signage, posters, flyers, menus, tickets, documents, maps, book covers, magazines, newspapers, screens, interfaces, buttons, or UI with readable content.',
    '- No engraved lettering, embossed lettering, printed lettering, stitched lettering, painted lettering, neon lettering, graffiti text, or decorative motifs that resemble writing.',
    '- Ignore phrases such as "texto grande", "titulo", "headline", "copy", "caption", "CTA", "hook", "sticker", "si o no", "encuesta", "poll", "quiz", "boton", "label", or similar content-direction instructions.',
    '- If the brief mentions a carousel cover, carousel slide, slide title, intro slide, final slide, swipe cue, or page number, ignore those textual or editorial instructions.',
    '',
    'Failure policy:',
    'If any area of the scene would normally include text, branding, a logo, or a readable interface, treat that as prohibited content and remove it completely.',
    'Do not attempt to approximate it. Do not blur it into partial readability. Do not replace it with invented characters.',
    'If the prompt mixes a visual concept with social-media text directions, discard the text directions and keep only the underlying visual scene.',
    '',
    'Replacement policy:',
    'Replace prohibited elements with blank surfaces, abstract shapes, generic unlabeled objects, neutral textures, empty signage, plain packaging, anonymous clothing, and non-readable decorative patterns.',
    'Use clean surfaces with no inscriptions, no printed details, no brand identifiers, and no symbolic marks that could be interpreted as writing.',
    '',
    'Composition guidance:',
    'Prefer angles, crops, prop design, and art direction that naturally avoid any need for text or logos.',
    'If a sign, screen, product, poster, or garment would be visible, render it as empty, generic, covered, turned away, or outside the frame.',
    '',
    'Quality bar:',
    'The result should feel intentional, polished, and fully visual, with strong composition, color, texture, lighting, and subject clarity.',
    'There must be no textual content, no branding, and nothing that even resembles readable writing.',
    '',
    'Final instruction:',
    'Return only a pure text-free, logo-free image.',
  ].join('\n')
}

function runNextInQueue() {
  while (activeGenerations < MAX_CONCURRENT_GENERATIONS && queue.length > 0) {
    const nextTask = queue.shift()
    if (!nextTask) break

    activeGenerations += 1
    nextTask()
  }
}

async function requestImage(prompt: string): Promise<string> {
  const res = await fetch(IMAGE_GENERATION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = (await res.json()) as GenerateImageResponse

  if (!res.ok) {
    throw new Error(data.error ?? 'Error al generar la imagen')
  }

  if (!data.image) {
    throw new Error('La respuesta del servidor no incluyó una imagen')
  }

  return data.image
}

function enqueueImageGeneration(prompt: string): Promise<string> {
  const normalizedPrompt = normalizePrompt(prompt)
  const cached = cache.get(normalizedPrompt)
  if (cached) {
    return Promise.resolve(cached)
  }

  const ongoingRequest = pending.get(normalizedPrompt)
  if (ongoingRequest) {
    return ongoingRequest
  }

  const request = new Promise<string>((resolve, reject) => {
    queue.push(async () => {
      try {
        const image = await requestImage(normalizedPrompt)
        cache.set(normalizedPrompt, image)
        resolve(image)
      } catch (err) {
        reject(
          err instanceof Error ? err : new Error('No se pudo conectar con el servidor'),
        )
      } finally {
        pending.delete(normalizedPrompt)
        activeGenerations = Math.max(0, activeGenerations - 1)
        runNextInQueue()
      }
    })

    runNextInQueue()
  })

  pending.set(normalizedPrompt, request)
  return request
}

export function useImageGeneration(): UseImageGenerationResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const generateImage = useCallback(async (prompt: string) => {
    const normalizedPrompt = normalizePrompt(prompt)
    if (!normalizedPrompt) return

    const finalPrompt = buildImagePrompt(normalizedPrompt)
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const cached = cache.get(finalPrompt)
    if (cached) {
      setImageUrl(cached)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const image = await enqueueImageGeneration(finalPrompt)

      if (requestIdRef.current !== requestId) return

      setImageUrl(image)
    } catch (err) {
      if (requestIdRef.current !== requestId) return

      setError(err instanceof Error ? err.message : 'Error al generar la imagen')
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false)
      }
    }
  }, [])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    setImageUrl(null)
    setError(null)
    setLoading(false)
  }, [])

  return { imageUrl, loading, error, generateImage, reset }
}
