<template>
  <div>
    <h1>Edit Location</h1>

    <LocationForm v-model="form" submitText="Save Changes" @submit="onSubmit" />

    <div class="actions">
      <button v-if="!form.deletedAt" @click="archive" class="btn danger">Archive</button>
      <button v-else @click="restore" class="btn">Restore</button>
    </div>

    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'
import LocationForm from '@/components/admin/locations/LocationForm.vue'
import type { JobLocation } from '@/types/JobLocation'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const error = ref('')
const form = ref<JobLocation>({
  id: 0,
  customerId: 0,
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  deletedAt: null,
})

type LocationPayload = Omit<JobLocation, 'id' | 'deletedAt' | 'deletedBy' | 'customerId'>

async function load() {
  try {
    const locRes = await http.get(`/admin/locations/${id}`)

    if (!locRes.data) {
      error.value = 'Location not found'
      return
    }

    form.value = locRes.data
  } catch {
    error.value = 'Failed to load location'
  }
}

async function onSubmit(payload: LocationPayload) {
  try {
    await http.put(`/admin/locations/${id}`, payload)
    router.back()
  } catch {
    error.value = 'Failed to update location'
  }
}

async function archive() {
  await http.delete(`/admin/locations/${id}`)
  load()
}

async function restore() {
  await http.post(`/admin/locations/${id}/restore`)
  load()
}

onMounted(load)
</script>

<style scoped>
.actions {
  margin-top: 1rem;
}
.btn {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.btn.danger {
  background: #dc2626;
}
.error {
  margin-top: 1rem;
  color: red;
}
</style>
