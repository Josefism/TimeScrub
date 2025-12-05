<template>
  <div>
    <h1>Jobs</h1>

    <router-link class="btn" to="/admin/jobs/create"> + Add Job </router-link>

    <label class="checkbox">
      <input type="checkbox" v-model="showArchived" @change="loadJobs" />
      Show archived
    </label>

    <table class="table">
      <thead>
        <tr>
          <th>Job Name</th>
          <th>Customer</th>
          <th>Location</th>
          <th>Status</th>
          <th style="width: 200px"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="job in jobs" :key="job.id">
          <td>{{ job.name }}</td>

          <td>{{ job.customer?.name || '(unknown customer)' }}</td>

          <td>
            <div>{{ job.location?.name || '(No Name)' }}</div>
            <small>
              {{ job.location?.addressLine1 }}, {{ job.location?.city }} {{ job.location?.state }}
            </small>
          </td>

          <td>
            <span v-if="job.deletedAt" class="badge red">Archived</span>
            <span v-else class="badge green">Active</span>
          </td>

          <td>
            <router-link :to="`/admin/jobs/${job.id}/edit`" class="btn-sm"> Edit </router-link>

            <button v-if="!job.deletedAt" class="btn-sm danger" @click="archive(job.id)">
              Archive
            </button>

            <button v-else class="btn-sm" @click="restore(job.id)">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import type { Job } from '@/types/Job'

const jobs = ref<Job[]>([])
const showArchived = ref(false)
const error = ref('')

async function loadJobs() {
  try {
    const res = await http.get('/admin/jobs', {
      params: { showArchived: showArchived.value },
    })
    jobs.value = res.data as Job[]
  } catch {
    error.value = 'Failed to load jobs'
  }
}

async function archive(id: number) {
  await http.delete(`/admin/jobs/${id}`)
  loadJobs()
}

async function restore(id: number) {
  await http.post(`/admin/jobs/${id}/restore`)
  loadJobs()
}

onMounted(loadJobs)
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
}
.btn-sm {
  background: #3b82f6;
  margin-right: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  color: white;
}
.danger {
  background: #dc2626 !important;
}
.badge.red {
  background: #ef4444;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
}
.badge.green {
  background: #22c55e;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
