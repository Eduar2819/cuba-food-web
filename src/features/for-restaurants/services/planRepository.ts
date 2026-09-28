import { PLANS } from '@/data/plans'
import { mockResponse } from '@/shared/lib/mockApi'
import type { Plan } from '../types'

export interface PlanRepository {
  getPlans(): Promise<Plan[]>
}

export const planRepository: PlanRepository = {
  getPlans: () => mockResponse(PLANS),
}
