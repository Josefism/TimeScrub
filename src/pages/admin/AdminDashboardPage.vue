<template>
  <div>
    <h2>Overview</h2>

    <p v-if="adminTime.loading">Loading…</p>
    <p v-else-if="adminTime.error" style="color: red">
      {{ adminTime.error }}
    </p>

    <template v-else>
      <p><strong>Total hours logged:</strong> {{ totalHours.toFixed(2) }}</p>
      <p><strong>Total entries:</strong> {{ entryCount }}</p>

      <section style="margin-top: 1rem">
        <h3>Top Jobs by Hours</h3>
        <table v-if="jobTotals.length" border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>Job</th>
              <th>Total (HH:MM)</th>
              <th>Total (hours)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobTotals.slice(0, 5)" :key="job.jobId">
              <td>{{ job.jobName }}</td>
              <td>{{ formatDuration(job.totalMs) }}</td>
              <td>{{ job.totalHours.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else>No entries yet.</p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminTimeStore } from '@/stores/adminTimeStore'

const adminTime = useAdminTimeStore()

onMounted(() => {
  if (!adminTime.entries.length) {
    adminTime.loadEntries()
  }
})

const entryCount = computed(() => adminTime.entries.length)

const totalHours = computed(() => {
  const totalMs = adminTime.entries.reduce((sum, e) => sum + e.durationMs, 0)
  return totalMs / 1000 / 60 / 60
})

const jobTotals = computed(() => {
  const map = new Map<number, { jobId: number; jobName: string; totalMs: number }>()

  for (const entry of adminTime.entries) {
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

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}`
}
</script>
