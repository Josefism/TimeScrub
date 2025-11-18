<template>
  <div>
    <h1>Your Jobs</h1>

    <p v-if="jobsStore.loading">Loading jobs…</p>
    <p v-else-if="jobsStore.error" style="color: red">
      {{ jobsStore.error }}
    </p>
    <p v-else-if="jobsStore.jobs.length === 0">No jobs available.</p>

    <ul v-else>
      <li v-for="job in jobsStore.jobs" :key="job.id">
        <router-link :to="`/job/${job.id}`">
          {{ job.name }} — {{ job.city }}, {{ job.state }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobsStore'

const jobsStore = useJobsStore()

onMounted(() => {
  if (!jobsStore.jobs.length) {
    jobsStore.loadJobs()
  }
})
</script>
