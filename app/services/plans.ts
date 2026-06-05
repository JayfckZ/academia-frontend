import { apiFetch } from '../lib/api'

export type PlanDurationType = 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS'

export interface Plan {
  id: string
  name: string
  description: string | null
  price: number | string
  duration: number
  durationType: PlanDurationType
  active: boolean
}

export async function getPlans(): Promise<Plan[]> {
  try {
    const res = await apiFetch('/plans', { cache: 'no-store' })

    if (!res.ok) return []

    const data = await res.json()

    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.data)) return data.data
    if (data && Array.isArray(data.plans)) return data.plans

    return []
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return []
  }
}
