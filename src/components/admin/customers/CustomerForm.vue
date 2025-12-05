<template>
  <div>
    <h1>Create Customer</h1>

    <form @submit.prevent="onSubmit">
      <h3>Basic Info</h3>
      <input v-model="name" placeholder="Customer Name" required />

      <input v-model="contactName" placeholder="Contact Name" />
      <input v-model="contactEmail" placeholder="Contact Email" />
      <input v-model="contactPhone" placeholder="Contact Phone" />

      <h3>Business Address</h3>
      <input v-model="businessAddressLine1" placeholder="Address Line 1" required />
      <input v-model="businessAddressLine2" placeholder="Address Line 2" />
      <input v-model="businessCity" placeholder="City" required />
      <input v-model="businessState" placeholder="State" required />
      <input v-model="businessPostalCode" placeholder="Postal Code" required />

      <h3>Mailing Address</h3>
      <input v-model="mailingAddressLine1" placeholder="Address Line 1" />
      <input v-model="mailingCity" placeholder="City" />
      <input v-model="mailingState" placeholder="State" />
      <input v-model="mailingPostalCode" placeholder="Postal Code" />

      <button type="submit">Create</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import http from '@/api/http'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const contactName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')

const businessAddressLine1 = ref('')
const businessAddressLine2 = ref('')
const businessCity = ref('')
const businessState = ref('')
const businessPostalCode = ref('')

const mailingAddressLine1 = ref('')
const mailingAddressLine2 = ref('')
const mailingCity = ref('')
const mailingState = ref('')
const mailingPostalCode = ref('')

const error = ref('')

async function onSubmit() {
  try {
    await http.post('/admin/customers', {
      name: name.value,
      contactName: contactName.value,
      contactEmail: contactEmail.value,
      contactPhone: contactPhone.value,
      businessAddressLine1: businessAddressLine1.value,
      businessAddressLine2: businessAddressLine2.value,
      businessCity: businessCity.value,
      businessState: businessState.value,
      businessPostalCode: businessPostalCode.value,
      mailingAddressLine1: mailingAddressLine1.value,
      mailingAddressLine2: mailingAddressLine2.value,
      mailingCity: mailingCity.value,
      mailingState: mailingState.value,
      mailingPostalCode: mailingPostalCode.value,
    })

    router.push('/admin/customers')
  } catch {
    error.value = 'Failed to create customer'
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
