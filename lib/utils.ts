import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PLAN_OBJECTIVE_LABELS: Record<string, string> = {
  promote_offer: 'Vender más',
  gain_followers: 'Informar o educar',
  increase_engagement: 'Conectar',
  launch_product: 'Lanzar producto',
  retain_customers: 'Fidelizar clientes'
}

export function getPlanObjectiveLabel(objective: string | null): string {
  if (!objective) return 'Plan de contenido'
  return PLAN_OBJECTIVE_LABELS[objective] || objective
}
