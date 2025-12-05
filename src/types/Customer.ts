export interface Customer {
  id: number
  name: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string

  businessAddressLine1: string
  businessAddressLine2?: string
  businessCity: string
  businessState: string
  businessPostalCode: string
  businessCountry: string

  mailingAddressLine1?: string
  mailingAddressLine2?: string
  mailingCity?: string
  mailingState?: string
  mailingPostalCode?: string
  mailingCountry?: string

  deletedAt?: string | null
}
