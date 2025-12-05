export interface Job {
  id: number
  companyId: number
  customerId: number
  locationId: number

  name: string
  jobNote: string | null

  createdAt?: string
  updatedAt?: string
  deletedAt: string | null
  deletedBy?: number | null

  // When included from /jobs or /admin/jobs with include: { customer: true }
  customer?: {
    id: number
    name: string
    // you can add more fields here if you start selecting them
  }

  // When included with include/select on location
  location?: {
    id: number
    name: string | null
    addressLine1: string
    addressLine2?: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
}

/**
 * Model used by JobForm as v-model.
 * We keep IDs as strings because they are bound to <select> elements.
 * The edit page extends this with `deletedAt` for Archive/Restore buttons.
 */
export interface JobFormModel {
  customerId: string
  locationId: string
  name: string
  jobNote: string
  // optional so Edit page can do: JobFormModel & { deletedAt?: string | null }
  deletedAt?: string | null
}

/**
 * Payload shape that the backend expects for create/update job calls:
 * POST /admin/jobs
 * PUT  /admin/jobs/:id
 */
export interface JobPayload {
  name: string
  customerId: number
  locationId: number
  jobNote?: string
}
