export interface Plan {
  id: 'basico' | 'destacado' | 'premium'
  name: string
  /** MXN mensuales; 0 = gratis. */
  priceMonthly: number
  summary: string
  features: string[]
  recommended: boolean
}
