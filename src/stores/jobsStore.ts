import { defineStore } from 'pinia'
import { fetchJobs, type Job } from '@/api/jobs'

interface JobsState {
  jobs: Job[]
  loading: boolean
  error: string | null
}

export const useJobsStore = defineStore('jobs', {
  state: (): JobsState => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadJobs() {
      if (this.loading) return
      this.loading = true
      this.error = null
      try {
        this.jobs = await fetchJobs()
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load jobs'
      } finally {
        this.loading = false
      }
    },

    getJobById(id: string | number) {
      const idNum = typeof id === 'string' ? Number(id) : id
      return this.jobs.find((j) => j.id === idNum) ?? null
    },
  },
})
