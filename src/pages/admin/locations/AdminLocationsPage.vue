<template>
  <div>
    <h1>Locations for {{ customer?.name }}</h1>

    <router-link class="btn" :to="`/admin/customers/${customerId}/locations/create`">
      + Add Location
    </router-link>

    <label>
      <input type="checkbox" v-model="showArchived" @change="loadLocations" />
      Show archived
    </label>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Type</th>
          <th>Status</th>
          <th style="width: 200px"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="loc in locations" :key="loc.id">
          <td>{{ loc.name || '(No Name)' }}</td>

          <td>
            {{ loc.addressLine1 }}<br />
            {{ loc.city }}, {{ loc.state }} {{ loc.postalCode }}
          </td>

          <td>{{ loc.locationType || '(none)' }}</td>

          <td>
            <span v-if="loc.deletedAt" class="badge red">Archived</span>
            <span v-else class="badge green">Active</span>
          </td>

          <td>
            <router-link :to="`/admin/locations/${loc.id}`" class="btn-sm">Edit</router-link>

            <button v-if="!loc.deletedAt" @click="archive(loc.id)" class="btn-sm danger">
              Archive
            </button>

            <button v-else @click="restore(loc.id)" class="btn-sm">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import http from '@/api/http'
import type { JobLocation } from '@/types/JobLocation'
import type { Customer } from '@/types/Customer'

const route = useRoute()
const customerId = Number(route.params.customerId)

const locations = ref<JobLocation[]>([])
const customer = ref<Customer | null>(null)
const showArchived = ref(false)
const error = ref('')

async function loadCustomer() {
  const res = await http.get('/admin/customers', { params: { showArchived: true } })
  customer.value = res.data.find((c: Customer) => c.id == customerId)
}

async function loadLocations() {
  try {
    const res = await http.get(`/admin/customers/${customerId}/locations`, {
      params: { showArchived: showArchived.value },
    })
    locations.value = res.data as JobLocation[]
  } catch {
    error.value = 'Failed to load locations'
  }
}

async function archive(id: number) {
  await http.delete(`/admin/locations/${id}`)
  loadLocations()
}

async function restore(id: number) {
  await http.post(`/admin/locations/${id}/restore`)
  loadLocations()
}

onMounted(() => {
  loadCustomer()
  loadLocations()
})
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
</style>
