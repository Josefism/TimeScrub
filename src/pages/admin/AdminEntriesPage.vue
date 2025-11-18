<template>
  <div>
    <h2>Entries (All)</h2>

    <div style="margin-bottom: 1rem">
      <label>
        From:
        <input type="date" v-model="fromDate" />
      </label>
      <label style="margin-left: 1rem">
        To:
        <input type="date" v-model="toDate" />
      </label>
      <button style="margin-left: 1rem" @click="refresh">Apply</button>
    </div>

    <p v-if="adminTime.loading">Loading…</p>
    <p v-else-if="adminTime.error" style="color: red">
      {{ adminTime.error }}
    </p>
    <p v-else-if="entries.length === 0">No entries for selected range.</p>

    <div v-else>
      <p>
        <strong>Entries:</strong> {{ entries.length }}<br />
        <strong>Total hours:</strong> {{ totalHours.toFixed(2) }}
      </p>

      <table border="1" cellspacing="0" cellpadding="6">
        <thead>
          <tr>
            <th>Date</th>
            <th>Job</th>
            <th>Employee</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <td>{{ formatDate(entry.start) }}</td>
            <td>{{ entry.job?.name ?? `Job ${entry.jobId}` }}</td>
            <td>{{ entry.employee?.name ?? entry.employeeId }}</td>
            <td>{{ formatTime(entry.start) }}</td>
            <td>{{ formatTime(entry.end) }}</td>
            <td>{{ formatDuration(entry.durationMs) }}</td>
            <td>{{ entry.timeNote }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAdminTimeStore } from '@/stores/adminTimeStore'

const adminTime = useAdminTimeStore()

const fromDate = ref<string>('')
const toDate = ref<string>('')

onMounted(() => {
  if (!adminTime.entries.length) {
    adminTime.loadEntries()
  }
})

function refresh() {
  adminTime.loadEntries({
    from: fromDate.value || undefined,
    to: toDate.value || undefined,
  })
}

const entries = computed(() => adminTime.entries)

const totalHours = computed(() => {
  const totalMs = entries.value.reduce((sum, e) => sum + e.durationMs, 0)
  return totalMs / 1000 / 60 / 60
})

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
