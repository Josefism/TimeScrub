import { defineStore } from 'pinia'
import { fetchTimeEntries, type TimeEntryResponse } from '@/api/timeEntries'

interface AdminTimeState {
  entries: TimeEntryResponse[]
  loading: boolean
  error: string | null
}

export const useAdminTimeStore = defineStore('adminTime', {
  state: (): AdminTimeState => ({
    entries: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadEntries(params?: { from?: string; to?: string; employeeId?: number }) {
      this.loading = true
      this.error = null
      try {
        this.entries = await fetchTimeEntries(params)
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load time entries'
      } finally {
        this.loading = false
      }
    },
  },
})
