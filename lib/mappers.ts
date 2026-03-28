import type { Business, Audience, Product, ContentPlan, ContentPost, QuickGeneration } from './types'
import type { Tables } from './database.types'

// Transforman filas de Supabase (snake_case) a entidades del dominio (camelCase)

export function mapBusiness(row: Tables<'businesses'>): Business {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    industry: row.industry,
    description: row.description,
    colors: row.colors,
    logoUrl: row.logo_url,
    typography: row.typography,
    socialNetworks: row.social_networks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapAudience(row: Tables<'audiences'>): Audience {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    description: row.description,
    ageRange: row.age_range,
    interests: row.interests,
    behavior: row.behavior,
    networks: row.networks,
    location: row.location,
    createdAt: row.created_at,
  }
}

export function mapProduct(row: Tables<'products'>): Product {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    description: row.description,
    differentiator: row.differentiator,
    createdAt: row.created_at,
  }
}

export function mapContentPlan(row: Tables<'content_plans'>): ContentPlan {
  return {
    id: row.id,
    businessId: row.business_id,
    objective: row.objective,
    tone: row.tone,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    status: row.status as 'active' | 'archived',
    strategySummary: row.strategy_summary,
    recommendedActions: row.recommended_actions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapContentPost(row: Tables<'content_posts'>): ContentPost {
  return {
    id: row.id,
    planId: row.plan_id,
    scheduledDate: row.scheduled_date,
    network: row.network,
    format: row.format,
    copy: row.copy,
    imageSuggestion: row.image_suggestion,
    createdAt: row.created_at,
  }
}

export function mapQuickGeneration(row: Tables<'quick_generations'>): QuickGeneration {
  return {
    id: row.id,
    businessId: row.business_id,
    format: row.format,
    productId: row.product_id,
    audienceName: row.audience_name,
    detail: row.detail,
    copy: row.copy,
    imageSuggestion: row.image_suggestion,
    createdAt: row.created_at,
  }
}
