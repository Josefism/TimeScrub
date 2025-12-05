export interface JobLocation {
  id: number
  customerId: number

  name?: string

  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string

  locationType?: string
  internalNote?: string
  accessInstruction?: string
  latitude?: number | null
  longitude?: number | null
  isPrimary?: boolean
  tags?: string[]

  deletedAt: string | null
  deletedBy?: number | null
}
