<template>
  <div>
    <h1>Create Location</h1>

    <LocationForm v-model="form" submitText="Create Location" @submit="onSubmit" />

    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'
import LocationForm from '@/components/admin/locations/LocationForm.vue'

const route = useRoute()
const router = useRouter()
const customerId = route.params.customerId

const error = ref('')

const form = ref({
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  locationType: '',
  internalNote: '',
  accessInstruction: '',
  latitude: null,
  longitude: null,
  isPrimary: false,
  tags: [],
})

interface LocationPayload {
  name?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

async function onSubmit(payload: LocationPayload) {
  try {
    await http.post(`/admin/customers/${customerId}/locations`, payload)
    router.push(`/admin/customers/${customerId}/locations`)
  } catch {
    error.value = 'Failed to create location.'
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
