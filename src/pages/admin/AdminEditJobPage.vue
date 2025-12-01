<template>
  <div>
    <h1>Edit Job</h1>

    <form @submit.prevent="save" class="form">
      <label>Name</label>
      <input v-model="name" required />

      <label>Address Line 1</label>
      <input v-model="addressLine1" required />

      <label>Address Line 2</label>
      <input v-model="addressLine2" />

      <label>City</label>
      <input v-model="city" required />

      <label>State</label>
      <input v-model="state" required />

      <label>Postal Code</label>
      <input v-model="postalCode" required />

      <label>Country</label>
      <input v-model="country" required />

      <label>Job Note</label>
      <textarea v-model="jobNote"></textarea>

      <button type="submit">Save Changes</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const name = ref('')
const addressLine1 = ref('')
const addressLine2 = ref('')
const city = ref('')
const state = ref('')
const postalCode = ref('')
const country = ref('US')
const jobNote = ref('')
const error = ref('')

async function load() {
  try {
    const res = await http.get('/admin/jobs')
    const job = res.data.find((j: any) => j.id === id)

    if (!job) {
      error.value = 'Job not found'
      return
    }

    name.value = job.name
    addressLine1.value = job.addressLine1
    addressLine2.value = job.addressLine2
    city.value = job.city
    state.value = job.state
    postalCode.value = job.postalCode
    country.value = job.country
    jobNote.value = job.jobNote
  } catch {
    error.value = 'Failed to load job'
  }
}

async function save() {
  error.value = ''

  try {
    await http.put(`/admin/jobs/${id}`, {
      name: name.value,
      addressLine1: addressLine1.value,
      addressLine2: addressLine2.value,
      city: city.value,
      state: state.value,
      postalCode: postalCode.value,
      country: country.value,
      jobNote: jobNote.value,
    })

    router.push('/admin/jobs')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save job'
  }
}

onMounted(load)
</script>

<style scoped>
.form {
  display: flex;
  gap: 10px;
  flex-direction: column;
  max-width: 450px;
}
.error {
  color: red;
}
</style>
