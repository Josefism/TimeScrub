<template>
  <div>
    <h1>Edit Job</h1>

    <JobForm
      v-model="form"
      :customers="customers"
      :locations="locations"
      submitText="Save Changes"
      :isCreate="false"
      @submit="onSubmit"
    />

    <div class="actions">
      <button v-if="!form.deletedAt" class="btn danger" @click="archive">Archive</button>
      <button v-else class="btn" @click="restore">Restore</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'

import JobForm from '@/components/admin/jobs/JobForm.vue'
import type { JobFormModel, JobPayload, Job } from '@/types/Job'
import type { Customer } from '@/types/Customer'
import type { JobLocation } from '@/types/JobLocation'

const route = useRoute()
const router = useRouter()

const error = ref('')

const customers = ref<Customer[]>([])
const locations = ref<JobLocation[]>([])

// Form includes deletedAt for button logic
const form = ref<JobFormModel & { deletedAt?: string | null }>({
  customerId: '',
  locationId: '',
  name: '',
  jobNote: '',
  deletedAt: null,
})

async function loadCustomers() {
  const res = await http.get('/admin/customers')
  customers.value = res.data as Customer[]
}

async function loadLocations() {
  if (!form.value.customerId) {
    locations.value = []
    return
  }

  const customerId = form.value.customerId
  const res = await http.get(`/admin/customers/${customerId}/locations`)
  locations.value = res.data as JobLocation[]
}

async function loadJob() {
  try {
    const id = Number(route.params.id)
    const res = await http.get('/admin/jobs') // using existing endpoint
    const found: Job | undefined = res.data.find((j: Job) => j.id === id)

    if (!found) {
      error.value = 'Job not found'
      return
    }

    form.value = {
      customerId: String(found.customerId),
      locationId: String(found.locationId),
      name: found.name,
      jobNote: found.jobNote ?? '',
      deletedAt: found.deletedAt,
    }

    // Load locations for this customer
    await loadLocations()
  } catch {
    error.value = 'Failed to load job'
  }
}

async function onSubmit(payload: JobPayload) {
  try {
    await http.put(`/admin/jobs/${route.params.id}`, payload)
    router.push('/admin/jobs')
  } catch {
    error.value = 'Failed to update job'
  }
}

async function archive() {
  try {
    await http.delete(`/admin/jobs/${route.params.id}`)
    await loadJob()
  } catch {
    error.value = 'Failed to archive job'
  }
}

async function restore() {
  try {
    await http.post(`/admin/jobs/${route.params.id}/restore`)
    await loadJob()
  } catch {
    error.value = 'Failed to restore job'
  }
}

// When customer changes, reload locations
watch(
  () => form.value.customerId,
  () => loadLocations(),
)

onMounted(async () => {
  await loadCustomers()
  await loadJob()
})
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
.actions {
  margin-top: 1rem;
}
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.danger {
  background: #dc2626;
  color: white;
}
</style>
