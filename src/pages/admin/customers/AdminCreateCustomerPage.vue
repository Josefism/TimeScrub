<template>
  <div>
    <h1>Create Customer</h1>

    <CustomerForm v-model="form" submitText="Create Customer" @submit="onSubmit" />

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import http from '@/api/http'
import { useRouter } from 'vue-router'
import CustomerForm from '@/components/admin/customers/CustomerForm.vue'

const router = useRouter()
const error = ref('')

const form = ref({
  name: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  businessAddressLine1: '',
  businessAddressLine2: '',
  businessCity: '',
  businessState: '',
  businessPostalCode: '',
  businessCountry: 'US',
  mailingAddressLine1: '',
  mailingAddressLine2: '',
  mailingCity: '',
  mailingState: '',
  mailingPostalCode: '',
  mailingCountry: 'US',
})

interface CustomerFormPayload {
  name: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  businessAddressLine1: string
  businessAddressLine2?: string
  businessCity: string
  businessState: string
  businessPostalCode: string
  businessCountry?: string
  mailingAddressLine1?: string
  mailingAddressLine2?: string
  mailingCity?: string
  mailingState?: string
  mailingPostalCode?: string
  mailingCountry?: string
}

async function onSubmit(payload: CustomerFormPayload) {
  try {
    await http.post('/admin/customers', payload)
    router.push('/admin/customers')
  } catch {
    error.value = 'Failed to create customer.'
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
</style>
