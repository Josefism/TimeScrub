<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTimeStore } from '@/stores/timeStore'
import { useJobsStore } from '@/stores/jobsStore'

const route = useRoute()
const jobId = route.params.id as string

const time = useTimeStore()
const jobsStore = useJobsStore()

onMounted(() => {
  if (!jobsStore.jobs.length) {
    jobsStore.loadJobs()
  }
})

const job = computed(() => jobsStore.getJobById(jobId))

const activeEntryForThisJob = computed(() => {
  if (!time.activeEntry) return null
  return time.activeEntry.jobId === jobId ? time.activeEntry : null
})

const isRunning = computed(() => time.isRunning && !!activeEntryForThisJob.value)

const elapsedMs = ref(0)
let timerId: number | null = null
const errorMessage = ref('')

// --- time calculations ---
function updateElapsed() {
  const entry = activeEntryForThisJob.value

  if (!entry) {
    elapsedMs.value = 0
    return
  }

  if (isRunning.value && entry.lastStart != null) {
    elapsedMs.value = entry.durationMs + (Date.now() - entry.lastStart)
  } else {
    elapsedMs.value = entry.durationMs
  }
}

function startInterval() {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }

  if (isRunning.value) {
    timerId = window.setInterval(() => {
      updateElapsed()
    }, 1000)
  }
}

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(elapsedMs.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})

const showSaveButton = computed(() => {
  const entry = activeEntryForThisJob.value
  return !!entry && !isRunning.value && entry.durationMs > 0
})

// --- button handlers ---
function onToggleTimer() {
  errorMessage.value = ''

  try {
    if (isRunning.value) {
      time.stopTimer()
    } else {
      time.startTimer(jobId)
    }

    updateElapsed()
    startInterval()
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Could not toggle timer.'
  }
}

function onSave() {
  errorMessage.value = ''
  try {
    const note = window.prompt('Add a note for this time entry (optional):') ?? undefined
    time.saveCurrentEntry(note)
    updateElapsed()
    startInterval()
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Could not save entry.'
  }
}

function onClear() {
  errorMessage.value = ''
  time.clearCurrentEntry()
  updateElapsed()
  startInterval()
}

// --- lifecycle ---
onMounted(() => {
  updateElapsed()
  startInterval()
})

onUnmounted(() => {
  if (timerId !== null) clearInterval(timerId)
})

watch(
  () => [time.activeEntry, time.isRunning],
  () => {
    updateElapsed()
    startInterval()
  },
)
</script>

<template>
  <div v-if="job">
    <h1>{{ job.name }}</h1>
    <p>
      {{ job.addressLine1 }}<br />
      <span v-if="job.addressLine2">{{ job.addressLine2 }}<br /></span>
      {{ job.city }}, {{ job.state }} {{ job.postalCode }}
    </p>

    <div style="margin: 1rem 0">
      <strong>Time:</strong>
      <span style="font-family: monospace; font-size: 1.5rem">
        {{ formattedTime }}
      </span>
    </div>

    <button @click="onToggleTimer">
      {{ isRunning ? 'Stop Timer' : 'Start Timer' }}
    </button>

    <button v-if="showSaveButton" style="margin-left: 1rem" @click="onSave">Save Time Entry</button>

    <button v-if="activeEntryForThisJob" style="margin-left: 0.5rem" @click="onClear">Clear</button>

    <p v-if="errorMessage" style="color: red; margin-top: 0.5rem">
      {{ errorMessage }}
    </p>
  </div>

  <p v-else>Job not found.</p>
</template>
