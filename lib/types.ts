// ─── Entidades de dominio ─────────────────────────────────────────────────────

export interface Business {
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

export interface Audience {
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

export interface Product {
  id: string
  businessId: string
  name: string
  description: string | null
  differentiator: string | null
  createdAt: string
}

export interface ContentPlan {
  id: string
  businessId: string
  audienceId: string | null
  objective: string
  tone: string
  periodStart: string
  periodEnd: string
  status: 'active' | 'archived'
  strategySummary: string | null
  recommendedActions: string[]
  createdAt: string
  updatedAt: string
}

export interface ContentPost {
  id: string
  planId: string
  scheduledDate: string
  network: string
  format: string
  copy: string
  imageSuggestion: string | null
  createdAt: string
}

export interface QuickGeneration {
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

// ─── API Requests ─────────────────────────────────────────────────────────────

export interface CreateBusinessRequest {
  name: string
  industry: string
  description: string
  colors?: string
  logoUrl?: string
  typography?: string
  socialNetworks: string[]
}

export type UpdateBusinessRequest = Partial<CreateBusinessRequest>

export interface CreateAudienceRequest {
  name: string
  description?: string
  ageRange?: string
  interests?: string
  behavior?: string
  networks?: string[]
  location?: string
}

export type UpdateAudienceRequest = Partial<CreateAudienceRequest>

export interface CreateProductRequest {
  name: string
  description?: string
  differentiator?: string
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export interface GenerateQuickRequest {
  format: 'post' | 'reel' | 'carrusel' | 'historia'
  productId?: string
  audienceName?: string
  detail?: string
}

export interface SaveQuickGenerationRequest {
  format: string
  productId?: string
  audienceName?: string
  detail?: string
  copy: string
  imageSuggestion?: string
}

export interface CreateContentPlanRequest {
  objective: string
  audienceId?: string
  tone: string
  periodStart: string
  periodEnd: string
  detail?: string
}

export interface SaveContentPlanRequest {
  planId: string
  posts: Array<{
    scheduledDate: string
    network: string
    format: string
    copy: string
    imageSuggestion?: string
  }>
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface BusinessResponse extends Business {
  audiences: Audience[]
  products: Product[]
}

export interface ContentPlanResponse extends ContentPlan {
  posts: ContentPost[]
  audience: Audience | null
}

export interface CalendarEntry {
  date: string
  planId: string
  planObjective: string
  postId: string
  network: string
  format: string
  copy: string
  imageSuggestion: string | null
}

export interface CalendarResponse {
  entries: CalendarEntry[]
}

// ─── Capa de IA (en memoria, nunca se persisten) ──────────────────────────────

export interface AIVariant {
  variant: 1 | 2 | 3
  copy: string
  imageSuggestion: string
}

export interface GenerateQuickResponse {
  variants: AIVariant[]
}

export interface AIPlanPost {
  scheduledDate: string
  network: string
  format: string
  variants: AIVariant[]
}

export interface GeneratePlanResponse {
  planId: string
  strategySummary: string
  recommendedActions: string[]
  posts: AIPlanPost[]
}

// ─── Utils → IA ───────────────────────────────────────────────────────────────

export interface BusinessContext {
  business: Business
  audiences: Audience[]
  products: Product[]
}

export interface BuildQuickPromptParams extends BusinessContext {
  format: string
  productName?: string
  audienceName?: string
  detail?: string
}

export interface BuildPlanPromptParams extends BusinessContext {
  objective: string
  audienceName?: string
  tone: string
  periodStart: string
  periodEnd: string
  detail?: string
}

// ─── Zustand stores ───────────────────────────────────────────────────────────

export interface AppStore {
  userId: string | null
  isAuthenticated: boolean
  business: BusinessResponse | null
  setUser: (userId: string) => void
  setBusiness: (business: BusinessResponse) => void
  clearSession: () => void
}

export interface QuickGenStore {
  variants: AIVariant[] | null
  isGenerating: boolean
  setVariants: (variants: AIVariant[]) => void
  clearVariants: () => void
}

export interface PlanGenStore {
  result: GeneratePlanResponse | null
  isGenerating: boolean
  setResult: (result: GeneratePlanResponse) => void
  clearResult: () => void
}
