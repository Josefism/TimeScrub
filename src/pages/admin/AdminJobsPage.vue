<template>
  <div>
    <h2>Jobs — Total Hours</h2>

    <p v-if="adminTime.loading">Loading…</p>
    <p v-else-if="adminTime.error" style="color: red">
      {{ adminTime.error }}
    </p>
    <p v-else-if="jobTotals.length === 0">No time entries yet.</p>

    <table v-else border="1" cellspacing="0" cellpadding="6">
      <thead>
        <tr>
          <th>Job</th>
          <th>Address</th>
          <th>Total (HH:MM)</th>
          <th>Total (hours)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobTotals" :key="job.jobId">
          <td>{{ job.jobName }}</td>
          <td>{{ job.address }}</td>
          <td>{{ formatDuration(job.totalMs) }}</td>
          <td>{{ job.totalHours.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
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

const jobTotals = computed(() => {
  const map = new Map<
    number,
    { jobId: number; jobName: string; address: string; totalMs: number }
  >()

  for (const entry of adminTime.entries) {
    const job = entry.job
    const jobId = entry.jobId

    const existing = map.get(jobId)

    const address = job ? `${job.addressLine1}, ${job.city}, ${job.state} ${job.postalCode}` : ''

    if (existing) {
      existing.totalMs += entry.durationMs
    } else {
      map.set(jobId, {
        jobId,
        jobName: job?.name ?? `Job ${jobId}`,
        address,
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
