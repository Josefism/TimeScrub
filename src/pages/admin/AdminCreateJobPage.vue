<template>
  <div>
    <h2>Create Job</h2>

    <form @submit.prevent="onSubmit" class="form">
      <label>Job Name</label>
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
      <input v-model="country" />

      <label>Job Note</label>
      <textarea v-model="jobNote"></textarea>

      <button type="submit">Create Job</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

const router = useRouter()

const name = ref('')
const addressLine1 = ref('')
const addressLine2 = ref('')
const city = ref('')
const state = ref('')
const postalCode = ref('')
const country = ref('US')
const jobNote = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''

  try {
    await http.post('/admin/jobs', {
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
    error.value = err.response?.data?.error || 'Error creating job'
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}
.error {
  color: red;
}
</style>
