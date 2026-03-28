import type {
  BusinessResponse,
  ContentPlanResponse,
  QuickGeneration,
  CalendarResponse,
  GenerateQuickResponse,
  GeneratePlanResponse,
} from './types'

export const MOCK_USER_ID = 'dev-user-id'
export const MOCK_BUSINESS_ID = 'biz-001'

export const MOCK_BUSINESS: BusinessResponse = {
  id: MOCK_BUSINESS_ID,
  userId: MOCK_USER_ID,
  name: 'La Esquina de María',
  industry: 'Panadería artesanal',
  description: 'Panadería artesanal en Palermo con recetas familiares y productos sin conservantes.',
  colors: '#C8A97E,#4A3728',
  logoUrl: null,
  typography: null,
  socialNetworks: ['instagram', 'facebook'],
  createdAt: '2026-03-28T10:00:00Z',
  updatedAt: '2026-03-28T10:00:00Z',
  audiences: [
    {
      id: 'aud-001',
      businessId: MOCK_BUSINESS_ID,
      name: 'Mamás del barrio',
      description: 'Mujeres que buscan productos frescos y caseros para su familia',
      ageRange: '30-45',
      interests: 'Cocina casera, familia, productos artesanales',
      behavior: 'Revisan Instagram por la mañana antes de salir',
      networks: ['instagram', 'facebook'],
      location: 'Palermo, Buenos Aires',
      createdAt: '2026-03-28T10:00:00Z',
    },
  ],
  products: [
    {
      id: 'prod-001',
      businessId: MOCK_BUSINESS_ID,
      name: 'Medialunas artesanales',
      description: 'Hechas con manteca real, sin conservantes. $1.500 la docena.',
      differentiator: 'Receta de la abuela, horneadas cada mañana',
      createdAt: '2026-03-28T10:00:00Z',
    },
    {
      id: 'prod-002',
      businessId: MOCK_BUSINESS_ID,
      name: 'Pan de masa madre',
      description: 'Pan artesanal con fermentación lenta de 24hs.',
      differentiator: 'Sin levadura industrial, proceso artesanal',
      createdAt: '2026-03-28T10:00:00Z',
    },
  ],
}

export const MOCK_PLANS: ContentPlanResponse[] = [
  {
    id: 'plan-001',
    businessId: MOCK_BUSINESS_ID,
    audienceId: 'aud-001',
    objective: 'Lanzar un producto nuevo',
    tone: 'Cercano',
    periodStart: '2026-03-28',
    periodEnd: '2026-04-04',
    status: 'active',
    strategySummary:
      'Para lanzar el pan de masa madre te recomendamos una estrategia en 3 etapas: anticipación, revelación y prueba social. El tono debe ser cercano y emotivo, destacando el proceso artesanal.',
    recommendedActions: [
      'Publicar una Story mostrando el proceso de preparación (video corto)',
      'Responder todos los comentarios en menos de 2 horas',
      'Pedirles a los primeros clientes que etiqueten a La Esquina de María',
    ],
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-28T10:00:00Z',
    audience: MOCK_BUSINESS.audiences[0],
    posts: [
      {
        id: 'post-001',
        planId: 'plan-001',
        scheduledDate: '2026-03-28',
        network: 'instagram',
        format: 'post',
        copy: 'Algo nuevo está llegando a La Esquina de María... y huele muy bien. ¿Adivinan qué es? 👀 #PanArtesanal #LaEsquinaDeMaría',
        imageSuggestion: 'Foto misteriosa de masa cruda en bowl de madera, luz cálida',
        createdAt: '2026-03-28T10:00:00Z',
      },
      {
        id: 'post-002',
        planId: 'plan-001',
        scheduledDate: '2026-03-30',
        network: 'instagram',
        format: 'reel',
        copy: '¡Ya está acá! Nuestro pan de masa madre llegó para quedarse 🍞 Fermentación lenta de 24hs, sin levadura industrial. Pasá a buscarlo. #MasaMadre #PanArtesanal',
        imageSuggestion: 'Video del pan recién horneado saliendo del horno, vapor visible',
        createdAt: '2026-03-28T10:00:00Z',
      },
    ],
  },
  {
    id: 'plan-002',
    businessId: MOCK_BUSINESS_ID,
    audienceId: 'aud-001',
    objective: 'Fidelizar clientes existentes',
    tone: 'Informal',
    periodStart: '2026-04-01',
    periodEnd: '2026-04-30',
    status: 'archived',
    strategySummary: 'Estrategia de fidelización mensual basada en acciones directas con clientes.',
    recommendedActions: ['Sorteo mensual para clientes frecuentes', 'Descuento del 10% los martes'],
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-10T10:00:00Z',
    audience: MOCK_BUSINESS.audiences[0],
    posts: [],
  },
]

export const MOCK_QUICK_GENERATIONS: QuickGeneration[] = [
  {
    id: 'quick-001',
    businessId: MOCK_BUSINESS_ID,
    format: 'post',
    productId: 'prod-001',
    audienceName: 'Mamás del barrio',
    detail: 'Es jueves, mañana hay feriado',
    copy: '¿Ya tenés el desayuno del feriado resuelto? 🥐 Nuestras medialunas artesanales, hechas con manteca real y la receta de siempre, te esperan mañana desde las 7am. ¡Pasá a buscarlas antes de que se agoten! #Medialunas #PanaderíaArtesanal',
    imageSuggestion: 'Foto cálida de medialunas recién horneadas sobre papel manteca',
    createdAt: '2026-03-27T09:00:00Z',
  },
]

export const MOCK_CALENDAR: CalendarResponse = {
  entries: [
    {
      date: '2026-03-28',
      planId: 'plan-001',
      planObjective: 'Lanzar un producto nuevo',
      postId: 'post-001',
      network: 'instagram',
      format: 'post',
      copy: 'Algo nuevo está llegando a La Esquina de María...',
      imageSuggestion: 'Foto misteriosa de masa cruda en bowl de madera',
    },
    {
      date: '2026-03-30',
      planId: 'plan-001',
      planObjective: 'Lanzar un producto nuevo',
      postId: 'post-002',
      network: 'instagram',
      format: 'reel',
      copy: '¡Ya está acá! Nuestro pan de masa madre llegó para quedarse 🍞',
      imageSuggestion: 'Video del pan recién horneado saliendo del horno',
    },
  ],
}

export const MOCK_GENERATE_QUICK: GenerateQuickResponse = {
  variants: [
    {
      variant: 1,
      copy: '¿Ya tenés el desayuno del feriado resuelto? 🥐 Nuestras medialunas artesanales, hechas con manteca real y la receta de siempre, te esperan mañana desde las 7am. ¡Pasá a buscarlas antes de que se agoten! #Medialunas #PanaderíaArtesanal',
      imageSuggestion: 'Foto cálida de medialunas recién horneadas sobre papel manteca, luz natural de mañana',
    },
    {
      variant: 2,
      copy: 'Mañana es feriado y en La Esquina de María abrimos igual 🙌 Porque el desayuno artesanal no descansa. Medialunas de manteca desde las 7am. ¡Te esperamos! #FeriadoDeliciosos #LaEsquinaDeMaría',
      imageSuggestion: 'Foto de una familia desayunando con medialunas en una mesa con luz de mañana',
    },
    {
      variant: 3,
      copy: 'La receta de la abuela no tiene feriados 🥐✨ Mañana encontrás nuestras medialunas artesanales bien fresquitas desde las 7am. Sin conservantes, con todo el sabor de siempre. #Artesanal #PanaderíaPalermo',
      imageSuggestion: 'Close up de medialunas doradas con azúcar impalpable, fondo blanco limpio',
    },
  ],
}

export const MOCK_GENERATE_PLAN: GeneratePlanResponse = {
  planId: 'plan-new-001',
  strategySummary:
    'Para lanzar tu pan de masa madre con las mamás del barrio te recomendamos una estrategia de lanzamiento en 3 etapas: anticipación (generar curiosidad antes del lanzamiento), revelación (el día del lanzamiento) y prueba social (mostrar reacciones de los primeros clientes). El tono debe ser cercano y emotivo, destacando el proceso artesanal.',
  recommendedActions: [
    'Publicar una Story el martes mostrando el proceso de preparación (video corto)',
    'Responder todos los comentarios del post de anticipación en menos de 2 horas',
    'Pedirles a los primeros clientes que etiqueten a La Esquina de María en sus fotos',
  ],
  posts: [
    {
      scheduledDate: '2026-04-01',
      network: 'instagram',
      format: 'post',
      variants: [
        {
          variant: 1,
          copy: 'Algo nuevo está llegando a La Esquina de María... y huele muy bien. ¿Adivinan qué es? 👀 #PanArtesanal',
          imageSuggestion: 'Foto misteriosa de masa cruda en bowl de madera, luz cálida',
        },
        {
          variant: 2,
          copy: 'En La Esquina de María estamos preparando algo muy especial para ustedes 🍞 ¿Se animan a adivinar? #Novedad #Panadería',
          imageSuggestion: 'Manos amasando pan con harina espolvoreada, vista cenital',
        },
        {
          variant: 3,
          copy: '24 horas de fermentación. Receta artesanal. Muy pronto en La Esquina de María 👀 #MasaMadre #Artesanal',
          imageSuggestion: 'Primer plano de masa madre burbujeante en frasco de vidrio',
        },
      ],
    },
    {
      scheduledDate: '2026-04-03',
      network: 'instagram',
      format: 'reel',
      variants: [
        {
          variant: 1,
          copy: '¡Ya está acá! Nuestro pan de masa madre llegó para quedarse 🍞 Fermentación lenta de 24hs, sin levadura industrial. Pasá a buscarlo. #MasaMadre',
          imageSuggestion: 'Video del pan recién horneado saliendo del horno, vapor visible',
        },
        {
          variant: 2,
          copy: 'El pan que esperaron llegó 🙌 Pan de masa madre artesanal, directo del horno a tu mesa. Disponible desde hoy en La Esquina de María. #Lanzamiento',
          imageSuggestion: 'Time lapse del proceso de horneado del pan de masa madre',
        },
        {
          variant: 3,
          copy: 'Presentamos nuestro pan de masa madre ✨ 24 horas de fermentación, cero conservantes, 100% artesanal. Vení a probarlo. #NuevoProducto #PanArtesanal',
          imageSuggestion: 'Pan de masa madre cortado al medio mostrando la miga, sobre tabla de madera',
        },
      ],
    },
  ],
}
