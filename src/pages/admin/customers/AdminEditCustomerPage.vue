<template>
  <div>
    <h1>Edit Customer</h1>

    <CustomerForm v-model="form" submitText="Save Changes" @submit="onSubmit" />

    <div class="actions">
      <button v-if="!form.deletedAt" class="btn danger" @click="archive">Archive</button>
      <button v-else class="btn" @click="restore">Restore</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'
import CustomerForm from '@/components/admin/customers/CustomerForm.vue'

// -------- Types --------
interface Customer {
  id: number
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

  deletedAt: string | null
  deletedBy?: number | null

  _count?: {
    locations: number
    jobs: number
  }
}

type CustomerFormPayload = Omit<Customer, 'id' | '_count' | 'deletedAt' | 'deletedBy'>

// -------- Component Logic --------
const route = useRoute()
const router = useRouter()
const error = ref('')

// form has a correct initial shape
const form = ref<Customer>({
  id: 0,
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
  deletedAt: null,
})

// load customer data
async function load() {
  try {
    const { id } = route.params
    const res = await http.get('/admin/customers', { params: { showArchived: true } })

    const found = res.data.find((c: Customer) => c.id === Number(id))
    if (!found) {
      error.value = 'Customer not found'
      return
    }

    form.value = found
  } catch {
    error.value = 'Failed to load customer'
  }
}

// typed payload
async function onSubmit(payload: CustomerFormPayload) {
  try {
    await http.put(`/admin/customers/${route.params.id}`, payload)
    router.push('/admin/customers')
  } catch {
    error.value = 'Failed to update customer'
  }
}

async function archive() {
  try {
    await http.delete(`/admin/customers/${route.params.id}`)
    load()
  } catch {
    error.value = 'Failed to archive customer'
  }
}

async function restore() {
  try {
    await http.post(`/admin/customers/${route.params.id}/restore`)
    load()
  } catch {
    error.value = 'Failed to restore customer'
  }
}

onMounted(load)
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
.btn.danger {
  background: #dc2626;
  color: white;
}
</style>
