import http from './http'
import type { Job } from './jobs'

export interface TimeEntryResponse {
  id: number
  companyId: number
  employeeId: number
  jobId: number
  start: string // ISO string from API
  end: string
  durationMs: number
  timeNote?: string | null
  createdAt: string
  job: Job
  employee: {
    id: number
    name: string
  }
}

export interface SaveTimeEntryPayload {
  jobId: number
  start: string
  end: string
  durationMs: number
  timeNote?: string | null
}

export async function createTimeEntry(payload: SaveTimeEntryPayload) {
  const response = await http.post('/time-entries', payload)
  return response.data
}

export async function fetchTimeEntries(params?: {
  from?: string
  to?: string
  employeeId?: number
}): Promise<TimeEntryResponse[]> {
  const response = await http.get<TimeEntryResponse[]>('/time-entries', {
    params,
  })
  return response.data
}
