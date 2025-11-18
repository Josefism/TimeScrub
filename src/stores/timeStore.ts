import { defineStore } from 'pinia'
import { createTimeEntry } from '@/api/timeEntries'

export interface Job {
  id: string
  name: string
  address: string
}

export interface TimeEntry {
  id: string
  jobId: string

  // first time this entry was started (used as the "date" in history)
  start: number

  // last time we resumed/started (used while running)
  lastStart: number | null

  // last time we stopped (null while still running)
  end: number | null

  // total accumulated ms (may come from multiple start/stop cycles)
  durationMs: number

  timeNote?: string | null
}

interface TimeState {
  activeEntry: TimeEntry | null // in-progress for some job (running or paused)
  isRunning: boolean
}

export const useTimeStore = defineStore('time', {
  state: (): TimeState => ({
    activeEntry: null,
    isRunning: false,
  }),

  actions: {
    startTimer(jobId: string) {
      const now = Date.now()

      // If we already have an active entry for another job, block it
      if (this.activeEntry && this.activeEntry.jobId !== jobId) {
        throw new Error(
          'You already have a timer in progress for another job. Save or clear it first.',
        )
      }

      // If no active entry yet, create one
      if (!this.activeEntry) {
        this.activeEntry = {
          id: crypto.randomUUID(),
          jobId,
          start: now,
          lastStart: now,
          end: null,
          durationMs: 0,
        }
      } else {
        // Resuming the same job: just set lastStart
        this.activeEntry.lastStart = now
      }

      this.isRunning = true
    },

    stopTimer() {
      if (!this.activeEntry || !this.isRunning || this.activeEntry.lastStart === null) {
        return
      }

      const now = Date.now()
      const delta = now - this.activeEntry.lastStart

      this.activeEntry.durationMs += delta
      this.activeEntry.lastStart = null
      this.activeEntry.end = now

      this.isRunning = false
    },

    async saveCurrentEntry(timeNote?: string) {
      if (!this.activeEntry) return
      if (this.isRunning) {
        throw new Error('Stop the timer before saving.')
      }

      // Only save if there is some time accumulated
      if (this.activeEntry.durationMs <= 0) {
        return
      }

      const JobIdNumber = Number(this.activeEntry.jobId)

      await createTimeEntry({
        jobId: JobIdNumber,
        start: new Date(this.activeEntry.start).toISOString(),
        end: new Date(this.activeEntry.end!).toISOString(),
        durationMs: this.activeEntry.durationMs,
        timeNote,
      })

      this.activeEntry = null
      this.isRunning = false
    },

    clearCurrentEntry() {
      this.activeEntry = null
      this.isRunning = false
    },
  },

  persist: true,
})
