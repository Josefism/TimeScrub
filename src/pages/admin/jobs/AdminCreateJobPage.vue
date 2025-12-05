<template>
  <div>
    <h1>Create Job</h1>

    <JobForm
      v-model="form"
      :customers="customers"
      :locations="locations"
      submitText="Create Job"
      :isCreate="true"
      @submit="onSubmit"
    />

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

import JobForm from '@/components/admin/jobs/JobForm.vue'
import type { JobFormModel, JobPayload } from '@/types/Job'
import type { Customer } from '@/types/Customer'
import type { JobLocation } from '@/types/JobLocation'

const router = useRouter()
const error = ref('')

const customers = ref<Customer[]>([])
const locations = ref<JobLocation[]>([])

/**
 * Initialize the form with empty/default values.
 * IDs are strings in the form until submission.
 */
const form = ref<JobFormModel>({
  customerId: '',
  locationId: '',
  name: '',
  jobNote: '',
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

// When customer changes, reload location list
watch(
  () => form.value.customerId,
  () => loadLocations(),
)

async function onSubmit(payload: JobPayload) {
  try {
    await http.post('/admin/jobs', payload)
    router.push('/admin/jobs')
  } catch {
    error.value = 'Failed to create job'
  }
}

onMounted(async () => {
  await loadCustomers()
})
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
</style>
