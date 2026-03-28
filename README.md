# Marki — MVP Hackathon ITBA 2026

Plataforma web para que emprendedores y pymes generen estrategia de contenido para redes sociales con IA.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.local.example .env.local
```

Para desarrollo, solo necesitás:

```bash
SKIP_AUTH=true
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

## Levantar en desarrollo

```bash
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

Con `SKIP_AUTH=true`, no hace falta registrarse. La app carga directo con datos de demo ("La Esquina de María").

## Rutas disponibles

| Ruta | Descripción |
|---|---|
| `/dashboard` | Pantalla principal |
| `/onboarding` | Carga de datos del negocio (primera vez) |
| `/generate` | Generación rápida de posts |
| `/plans` | Lista de planes |
| `/plans/new` | Crear nuevo plan de contenido |
| `/plans/[id]` | Detalle de un plan |
| `/calendar` | Calendario unificado de todos los planes activos |
| `/settings` | Editar datos del negocio |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |

## Endpoints de la API

Todos los endpoints responden con mocks que respetan los contratos definidos en `lib/types.ts`.

```
GET    /api/business
POST   /api/business
PUT    /api/business

POST   /api/audiences
PUT    /api/audiences/[id]
DELETE /api/audiences/[id]

POST   /api/products
PUT    /api/products/[id]
DELETE /api/products/[id]

GET    /api/plans
POST   /api/plans
GET    /api/plans/[id]
PATCH  /api/plans/[id]

POST   /api/generate/quick
POST   /api/generate/plan

GET    /api/quick-generations
POST   /api/quick-generations

GET    /api/calendar
```

## Estructura del proyecto

```
app/
  (auth)/         → login, registro
  (app)/          → todas las pantallas autenticadas
  api/            → endpoints backend
lib/
  types.ts        → interfaces TypeScript (contratos entre capas)
  mock-data.ts    → datos de demo
  auth.ts         → helper de sesión (soporta SKIP_AUTH)
  ai.ts           → abstracción de proveedor IA (groq/openai/gemini)
  prompts.ts      → construcción de prompts
  supabase.ts     → cliente Supabase (placeholder)
middleware.ts     → protección de rutas
```

## Estado actual

Primera iteración — mocks estáticos. Los `TODO` en el código marcan los puntos de integración con Supabase y la IA real.
