<template>
  <div>
    <h1>My Hours</h1>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" style="color: red">{{ error }}</p>

    <p v-else-if="entriesSorted.length === 0">No time entries saved yet.</p>

    <div v-else>
      <!-- Overall total -->
      <p style="margin: 0.5rem 0"><strong>Total time:</strong> {{ totalHours.toFixed(2) }} hours</p>

      <!-- Per-job totals -->
      <section style="margin: 1rem 0">
        <h2 style="margin-bottom: 0.5rem">Per-job totals</h2>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>Job</th>
              <th>Total (HH:MM)</th>
              <th>Total (hours)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobTotals" :key="job.jobId">
              <td>{{ job.jobName }}</td>
              <td>{{ formatDuration(job.totalMs) }}</td>
              <td>{{ job.totalHours.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Detailed entries -->
      <section style="margin-top: 1rem">
        <h2 style="margin-bottom: 0.5rem">Entries</h2>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>Date</th>
              <th>Job</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in entriesSorted" :key="entry.id">
              <td>{{ formatDate(entry.start) }}</td>
              <td>{{ entry.job?.name ?? `Job ${entry.jobId}` }}</td>
              <td>{{ formatTime(entry.start) }}</td>
              <td>{{ formatTime(entry.end) }}</td>
              <td>{{ formatDuration(entry.durationMs) }}</td>
              <td>{{ entry.timeNote }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchTimeEntries, type TimeEntryResponse } from '@/api/timeEntries'

const entries = ref<TimeEntryResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    entries.value = await fetchTimeEntries()
  } catch (err: any) {
    error.value = err?.message ?? 'Failed to load time entries'
  } finally {
    loading.value = false
  }
})

// newest first
const entriesSorted = computed(() =>
  [...entries.value].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
)

const totalHours = computed(() => {
  const totalMs = entries.value.reduce((sum, e) => sum + e.durationMs, 0)
  return totalMs / 1000 / 60 / 60
})

const jobTotals = computed(() => {
  const map = new Map<number, { jobId: number; jobName: string; totalMs: number }>()

  for (const entry of entries.value) {
    const jobId = entry.jobId
    const existing = map.get(jobId)

    if (existing) {
      existing.totalMs += entry.durationMs
    } else {
      map.set(jobId, {
        jobId,
        jobName: entry.job?.name ?? `Job ${jobId}`,
        totalMs: entry.durationMs,
      })
    }
  }

  return Array.from(map.values())
    .map((j) => ({
      ...j,
      totalHours: j.totalMs / 1000 / 60 / 60,
    }))
    .sort((a, b) => b.totalMs - a.totalMs)
})

// --- formatting helpers using ISO strings ---

function formatDate(timestamp: string): string {
  const d = new Date(timestamp)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp)
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}`
}
</script>
