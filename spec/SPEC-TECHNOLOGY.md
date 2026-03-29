# Marki — Especificación Técnica

**Versión:** 1.0
**Fecha:** 2026-03-28
**Equipo:** Hackathon ITBA 2026 — Categoría Marketing & Growth

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework | Next.js | 14 (App Router) | Frontend + API routes en un solo repo, deploy trivial en Vercel |
| Lenguaje | TypeScript | 5.x | Tipado estático, mejor DX en equipo |
| Base de datos | Supabase (PostgreSQL) | Latest | DB + Auth + Storage en uno, free tier suficiente para el hackathon |
| Auth | Supabase Auth | — | Email + contraseña, integrado con la DB |
| Storage | Supabase Storage | — | Upload de logos de marca |
| IA | Groq (principal) | — | Free tier, inferencia en 1-5s — ideal para demo |
| Estilos | Tailwind CSS | 3.x | Compatible con el flujo Stitch → Figma → código |
| Componentes | shadcn/ui | Latest | Solo para componentes complejos (modals, dropdowns, forms) |
| Server state | TanStack Query | 5.x | Caché automático, loading/error states, revalidación |
| Client state | Zustand | 4.x | Store global liviano para sesión y UI state |
| Deploy | Vercel | Free tier | Auto-deploy en cada push a `main` |

---

## 2. Arquitectura

### 2.1 Tipo de aplicación

**Monolito Next.js** — un solo repositorio con frontend y backend conviviendo.

```
Navegador → Next.js App (Vercel)
                ├── /app/*          → páginas y componentes React
                ├── /app/api/*      → API routes (backend)
                └── /lib/*          → lógica compartida
                        ├── supabase.ts   → cliente Supabase
                        ├── ai.ts         → capa de abstracción IA
                        └── prompts.ts    → construcción de prompts
```

No hay servidor separado. Las API routes de Next.js actúan como el backend.

### 2.2 Capa de abstracción de IA

El proveedor de IA es intercambiable mediante una variable de entorno `AI_PROVIDER`. Toda la app consume la función `generateContent()` de `lib/ai.ts` — nunca llama directamente a Groq u OpenAI.

```
AI_PROVIDER=groq     → usa Groq (default)
AI_PROVIDER=openai   → usa OpenAI GPT-4o
AI_PROVIDER=gemini   → usa Google Gemini Flash
```

```typescript
// lib/ai.ts — interfaz única, proveedor intercambiable
export async function generateContent(prompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? "groq"

  if (provider === "groq")   return callGroq(prompt)
  if (provider === "openai") return callOpenAI(prompt)
  if (provider === "gemini") return callGemini(prompt)

  throw new Error(`Proveedor de IA no soportado: ${provider}`)
}
```

Todos los proveedores deben devolver JSON válido. Se usa JSON mode nativo donde el proveedor lo soporte.

### 2.3 Consideración de performance — Vercel Free Tier

Vercel gratuito tiene un límite de **10 segundos** por API route serverless. Groq resuelve esto al ser significativamente más rápido que otros proveedores (1-5s típico).

Si en algún momento se cambia a un proveedor más lento, implementar **streaming** en la API route de generación de plan para evitar timeouts.

---

## 3. Base de Datos

### 3.1 Gestión del schema

El schema se define y gestiona desde **Supabase** (panel web + CLI). No se usa Prisma. El acceso a datos se hace con el cliente oficial `@supabase/supabase-js` **exclusivamente en el backend (API routes)**. El frontend nunca llama a Supabase directamente — toda comunicación con la DB pasa por las API routes.

Los tipos TypeScript se generan automáticamente con:

```bash
npx supabase gen types typescript --project-id <id> > lib/database.types.ts
```

Este archivo se regenera cada vez que se modifica el schema y se commitea al repo.

### 3.2 Tablas

#### `businesses`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| user_id | uuid | FK → auth.users, unique |
| name | text | obligatorio |
| industry | text | obligatorio |
| description | text | obligatorio |
| colors | text | hex separados por coma, opcional |
| logo_url | text | URL en Supabase Storage, opcional |
| typography | text | opcional |
| social_networks | text[] | ["instagram", "facebook", ...] |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

#### `audiences`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| business_id | uuid | FK → businesses, cascade delete |
| name | text | obligatorio |
| description | text | |
| age_range | text | ej: "30-45" |
| interests | text | |
| behavior | text | |
| networks | text[] | |
| location | text | |
| created_at | timestamptz | |

#### `products`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| business_id | uuid | FK → businesses, cascade delete |
| name | text | obligatorio |
| description | text | |
| differentiator | text | |
| created_at | timestamptz | |

#### `content_plans`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| business_id | uuid | FK → businesses, cascade delete |
| objective | text | |
| tone | text | |
| period_start | date | |
| period_end | date | |
| status | text | 'active' \| 'archived' |
| strategy_summary | text | generado por IA |
| recommended_actions | text[] | generado por IA |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `content_plan_audiences` *(junction)*
| Campo | Tipo | Notas |
|---|---|---|
| plan_id | uuid | FK → content_plans, cascade delete |
| audience_id | uuid | FK → audiences, cascade delete |
| PK | (plan_id, audience_id) | clave compuesta |

#### `content_plan_products` *(junction)*
| Campo | Tipo | Notas |
|---|---|---|
| plan_id | uuid | FK → content_plans, cascade delete |
| product_id | uuid | FK → products, cascade delete |
| PK | (plan_id, product_id) | clave compuesta |

> El MVP permite seleccionar una o más audiencias y uno o más productos por plan. El modelo soporta múltiples desde el inicio. Las audiencias y productos creados inline durante la creación del plan se persisten en sus tablas respectivas antes de asociarse al plan.

#### `content_posts`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| plan_id | uuid | FK → content_plans, cascade delete |
| scheduled_date | date | |
| network | text | |
| format | text | post, reel, carrusel, historia |
| copy | text | variante elegida por el usuario |
| image_suggestion | text | descripción de imagen de la variante elegida |
| created_at | timestamptz | |

> Las 3 variantes se generan en memoria y se muestran al usuario. Solo la elegida se persiste en `copy` e `image_suggestion`.

#### `quick_generations`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| business_id | uuid | FK → businesses, cascade delete |
| format | text | |
| product_id | uuid | FK → products, nullable |
| audience_name | text | |
| detail | text | opcional |
| copy | text | variante elegida por el usuario |
| image_suggestion | text | descripción de imagen de la variante elegida |
| created_at | timestamptz | |

> Las 3 variantes se generan en memoria y se muestran al usuario. Solo la elegida se persiste en `copy` e `image_suggestion`.

### 3.3 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Política base para todas:

```sql
-- El usuario solo ve y modifica los datos de su propio negocio
CREATE POLICY "owner_only" ON businesses
  USING (user_id = auth.uid());

-- Para tablas hijas, filtrar por business_id del negocio del usuario
CREATE POLICY "owner_only" ON audiences
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));
```

---

## 4. API Routes

Todas las rutas están bajo `/app/api/`. El `business_id` siempre se extrae de la sesión del usuario — nunca del body del request.

```
BUSINESS
  GET    /api/business                    → datos del negocio + audiencias + productos
  POST   /api/business                    → crear negocio (onboarding)
  PUT    /api/business                    → actualizar negocio (settings)

AUDIENCES
  POST   /api/audiences                   → crear audiencia
  PUT    /api/audiences/[id]              → editar audiencia
  DELETE /api/audiences/[id]              → eliminar audiencia

PRODUCTS
  POST   /api/products                    → crear producto
  PUT    /api/products/[id]               → editar producto
  DELETE /api/products/[id]              → eliminar producto

CONTENT PLANS
  GET    /api/plans                       → listar planes (?status=active|archived)
  POST   /api/plans                       → crear plan + disparar generación IA
  GET    /api/plans/[id]                  → detalle del plan con posts
  PATCH  /api/plans/[id]                  → archivar plan

GENERACIÓN IA
  POST   /api/generate/quick              → generar post puntual (3 variantes)
  POST   /api/generate/plan               → generar plan completo

QUICK GENERATIONS
  GET    /api/quick-generations           → historial de generaciones rápidas

CALENDAR
  GET    /api/calendar                    → todos los posts de planes activos unificados
```

---

## 5. Integración con IA

### 5.1 Proveedor: Groq

- **Modelo:** `llama-3.3-70b-versatile`
- **Formato de respuesta:** JSON mode (parámetro `response_format: { type: "json_object" }`)
- **Temperature:** 0.8 para generación rápida / 0.7 para plan de contenido
- **Timeout esperado:** 1-5 segundos

### 5.2 Estructura de prompts (`lib/prompts.ts`)

Cada prompt se construye en tres partes:

1. **Contexto del negocio** — nombre, rubro, descripción, audiencias, productos (función reutilizable `buildBusinessContext()`)
2. **Instrucción de tarea** — qué generar, con qué parámetros
3. **Schema de respuesta JSON** — estructura exacta que debe devolver la IA

El contexto del negocio se inyecta en todas las llamadas para que la IA siempre genere contenido personalizado.

### 5.3 Manejo de errores de IA

- Si la IA devuelve JSON inválido: reintentar automáticamente 1 vez
- Si falla el segundo intento: devolver error 503 con mensaje claro al frontend
- El frontend muestra: *"No pudimos generar el contenido. Verificá tu conexión e intentalo de nuevo."* + botón Reintentar
- No se persiste ningún resultado parcial en caso de error

---

## 6. Autenticación

### 6.1 Producción

- **Proveedor:** Supabase Auth
- **Método:** Email + contraseña
- **Middleware:** `middleware.ts` en la raíz del proyecto protege todas las rutas excepto `/login` y `/register`
- **Sesión:** manejada por Supabase con cookies httpOnly

### 6.2 Desarrollo — Skip de Auth

Para agilizar el desarrollo local, se puede bypassear la autenticación con:

```bash
# .env.local
SKIP_AUTH=true
```

Cuando `SKIP_AUTH=true`, el middleware inyecta un usuario hardcodeado (`dev-user-id`) en lugar de verificar la sesión. **Esta variable nunca debe estar en producción.**

---

## 7. Storage — Logos de Marca

- **Bucket:** `logos` (público)
- **Path:** `logos/{business_id}/{filename}`
- **Tipos permitidos:** jpg, png, webp, svg
- **Tamaño máximo:** 2MB
- **URL resultante:** se guarda en `businesses.logo_url`

---

## 8. Flujo de UI — Stitch → Figma → Código

El diseño se genera en **Stitch**, se refina en **Figma**, y se traduce a código con el siguiente flujo:

1. Diseñar pantallas en Stitch y exportar a Figma
2. Definir design tokens en Figma (colores, tipografía, spacing)
3. Mapear tokens a `tailwind.config.ts` (colores de marca, fuentes)
4. Usar **v0.dev** para generar componentes Next.js + Tailwind + shadcn desde el diseño
5. Ajustar el código generado e integrarlo al proyecto

shadcn/ui se usa para componentes complejos que serían costosos de construir desde cero: `Dialog`, `DropdownMenu`, `Calendar`, `Popover`, `Form`.

---

## 9. Estructura de Carpetas

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── generate/
│   │   ├── plans/
│   │   │   └── [id]/
│   │   ├── calendar/
│   │   └── settings/
│   └── api/
│       ├── business/
│       ├── audiences/
│       ├── products/
│       ├── plans/
│       ├── generate/
│       │   ├── quick/
│       │   └── plan/
│       └── calendar/
├── components/
│   ├── ui/           → componentes shadcn
│   └── app/          → componentes propios del producto
├── lib/
│   ├── supabase.ts   → cliente Supabase (solo server/API routes)
│   ├── ai.ts         → capa de abstracción IA
│   ├── prompts.ts    → construcción de prompts
│   └── database.types.ts  → tipos auto-generados por Supabase CLI
├── store/
│   └── index.ts      → stores de Zustand
└── middleware.ts     → protección de rutas + skip auth
```

---

## 10. Variables de Entorno

```bash
# Supabase (solo backend)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # nunca exponer al browser

# IA
AI_PROVIDER=groq                # groq | openai | gemini
GROQ_API_KEY=
OPENAI_API_KEY=                 # opcional, si se cambia de proveedor
GEMINI_API_KEY=                 # opcional, si se cambia de proveedor

# Desarrollo
SKIP_AUTH=false                 # true solo en local
```

---

## 11. División de Trabajo Sugerida

| Persona | Foco | Áreas |
|---|---|---|
| Dev 1 | Backend + IA | API routes, `lib/ai.ts`, `lib/prompts.ts`, schema DB, RLS |
| Dev 2 | Frontend core | Onboarding, layout, navegación, auth pages |
| Dev 3 | Frontend features | Generación rápida, plan de contenido, calendario |
| Dev 4 | Fullstack + QA | Settings, historial, bugs, deploy, datos de demo |

### Orden de implementación

```
Setup → repo, Supabase, Vercel, variables de entorno, primer deploy ✓
Core → CRUD de business/audiences/products + onboarding UI
Features → generación rápida end-to-end + plan de contenido
Integración → calendario unificado + mis planes + settings
Polish → bugs, loading states, mobile responsive
Demo → datos pre-cargados, ensayo del flujo, freeze de features
```

**Regla:** feature freeze a las 32 horas. Solo bugs y demo prep después.

---

## 12. Interfaces TypeScript

Contratos entre capas. Pendientes de validación antes de implementar.

### 12.1 Entidades de dominio (espejo de la DB)

```typescript
interface Business {
  id: string
  userId: string
  name: string
  industry: string
  description: string
  colors: string | null
  logoUrl: string | null
  typography: string | null
  socialNetworks: string[]
  createdAt: string
  updatedAt: string
}

interface Audience {
  id: string
  businessId: string
  name: string
  description: string | null
  ageRange: string | null
  interests: string | null
  behavior: string | null
  networks: string[]
  location: string | null
  createdAt: string
}

interface Product {
  id: string
  businessId: string
  name: string
  description: string | null
  differentiator: string | null
  createdAt: string
}

interface ContentPlan {
  id: string
  businessId: string
  objective: string
  tone: string
  periodStart: string   // YYYY-MM-DD
  periodEnd: string     // YYYY-MM-DD
  status: 'active' | 'archived'
  strategySummary: string | null
  recommendedActions: string[]
  createdAt: string
  updatedAt: string
}

interface ContentPost {
  id: string
  planId: string
  scheduledDate: string   // YYYY-MM-DD
  network: string
  format: string
  copy: string
  imageSuggestion: string | null
  createdAt: string
}

interface QuickGeneration {
  id: string
  businessId: string
  format: string
  productId: string | null
  audienceName: string | null
  detail: string | null
  copy: string
  imageSuggestion: string | null
  createdAt: string
}
```

---

### 12.2 Frontend → Backend (API requests)

```typescript
// BUSINESS
interface CreateBusinessRequest {
  name: string
  industry: string
  description: string
  colors?: string
  logoUrl?: string
  typography?: string
  socialNetworks: string[]
}

interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {}

// AUDIENCES
interface CreateAudienceRequest {
  name: string
  description?: string
  ageRange?: string
  interests?: string
  behavior?: string
  networks?: string[]
  location?: string
}

interface UpdateAudienceRequest extends Partial<CreateAudienceRequest> {}

// PRODUCTS
interface CreateProductRequest {
  name: string
  description?: string
  differentiator?: string
}

interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// GENERACIÓN RÁPIDA
interface GenerateQuickRequest {
  format: 'post' | 'reel' | 'carrusel' | 'historia'
  productId?: string
  audienceName?: string
  detail?: string
}

// GUARDAR GENERACIÓN RÁPIDA (luego de elegir variante en memoria)
interface SaveQuickGenerationRequest {
  format: string
  productId?: string
  audienceName?: string
  detail?: string
  copy: string
  imageSuggestion?: string
}

// PLAN DE CONTENIDO
interface CreateContentPlanRequest {
  objective: string
  audienceIds: string[]   // al menos uno requerido
  productIds: string[]    // al menos uno requerido
  tone: string
  periodStart: string     // YYYY-MM-DD
  periodEnd: string       // YYYY-MM-DD
  detail?: string
}

// GUARDAR PLAN (luego de elegir variantes en memoria para cada post)
interface SaveContentPlanRequest {
  planId: string
  posts: Array<{
    scheduledDate: string
    network: string
    format: string
    copy: string
    imageSuggestion?: string
  }>
}
```

---

### 12.3 Backend → Frontend (API responses)

```typescript
// BUSINESS (siempre incluye relaciones)
interface BusinessResponse extends Business {
  audiences: Audience[]
  products: Product[]
}

// PLAN (incluye sus posts guardados)
interface ContentPlanResponse extends ContentPlan {
  posts: ContentPost[]
  audiences: Audience[]   // una o más
  products: Product[]     // uno o más
}

// CALENDARIO UNIFICADO
interface CalendarEntry {
  date: string          // YYYY-MM-DD
  planId: string
  planObjective: string
  postId: string
  network: string
  format: string
  copy: string
  imageSuggestion: string | null
}

interface CalendarResponse {
  entries: CalendarEntry[]
}
```

---

### 12.4 Capa de IA — en memoria (nunca se persisten)

Estos tipos solo viven en el estado del frontend entre que la IA responde y el usuario elige.

```typescript
// Una variante individual generada por la IA
interface AIVariant {
  variant: 1 | 2 | 3
  copy: string
  imageSuggestion: string
}

// Respuesta de /api/generate/quick
interface GenerateQuickResponse {
  variants: AIVariant[]
}

// Un post dentro del plan generado por la IA (con sus 3 variantes)
interface AIPlanPost {
  scheduledDate: string
  network: string
  format: string
  variants: AIVariant[]
}

// Respuesta de /api/generate/plan
interface GeneratePlanResponse {
  planId: string
  strategySummary: string
  recommendedActions: string[]
  posts: AIPlanPost[]
}
```

---

### 12.5 Utils → IA (parámetros de construcción de prompts)

```typescript
// Contexto base del negocio — se inyecta en todos los prompts
interface BusinessContext {
  business: Business
  audiences: Audience[]
  products: Product[]
}

// Parámetros para buildQuickPrompt()
interface BuildQuickPromptParams extends BusinessContext {
  format: string
  productName?: string
  audienceName?: string
  detail?: string
}

// Parámetros para buildPlanPrompt()
interface BuildPlanPromptParams extends BusinessContext {
  objective: string
  selectedAudiences: Audience[]   // una o más audiencias seleccionadas
  selectedProducts: Product[]     // uno o más productos seleccionados
  tone: string
  periodStart: string
  periodEnd: string
  detail?: string
}
```

---

### 12.6 Zustand stores

```typescript
// Estado global de autenticación y negocio
interface AppStore {
  // Auth
  userId: string | null
  isAuthenticated: boolean

  // Negocio cargado (se hidrata al iniciar sesión)
  business: BusinessResponse | null

  // Acciones
  setUser: (userId: string) => void
  setBusiness: (business: BusinessResponse) => void
  clearSession: () => void
}

// Estado temporal del flujo de generación rápida
interface QuickGenStore {
  variants: AIVariant[] | null
  isGenerating: boolean
  setVariants: (variants: AIVariant[]) => void
  clearVariants: () => void
}

// Estado temporal del flujo de plan de contenido
interface PlanGenStore {
  result: GeneratePlanResponse | null
  isGenerating: boolean
  setResult: (result: GeneratePlanResponse) => void
  clearResult: () => void
}
```

---

*Spec generado para el Hackathon ITBA 2026 — BTS — Categoría Marketing & Growth*