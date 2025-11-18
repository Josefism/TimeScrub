import http from './http'

export interface Job {
  id: number
  name: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  jobNote?: string | null
  active: boolean
}

export async function fetchJobs(): Promise<Job[]> {
  const response = await http.get<Job[]>('/jobs')
  return response.data
}
