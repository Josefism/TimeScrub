<template>
  <div>
    <h1>Customers</h1>

    <router-link class="btn" to="/admin/customers/create">+ New Customer</router-link>

    <label>
      <input type="checkbox" v-model="showArchived" @change="loadCustomers" />
      Show archived
    </label>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Locations</th>
          <th>Jobs</th>
          <th>Status</th>
          <th style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in customers" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c._count.locations }}</td>
          <td>{{ c._count.jobs }}</td>
          <td>
            <span v-if="c.deletedAt" class="badge red">Archived</span>
            <span v-else class="badge green">Active</span>
          </td>
          <td>
            <router-link :to="`/admin/customers/${c.id}`" class="btn-sm">Edit</router-link>
            <router-link :to="`/admin/customers/${c.id}/locations`" class="btn-sm"
              >Locations</router-link
            >

            <button v-if="!c.deletedAt" @click="archive(c.id)" class="btn-sm danger">
              Archive
            </button>
            <button v-else @click="restore(c.id)" class="btn-sm">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/api/http'

interface CustomerListItem {
  id: number
  name: string
  deletedAt: string | null
  _count: {
    locations: number
    jobs: number
  }
}

const customers = ref<CustomerListItem[]>([])
const showArchived = ref(false)
const error = ref('')

async function loadCustomers() {
  try {
    const res = await http.get('/admin/customers', {
      params: { showArchived: showArchived.value },
    })
    customers.value = res.data
  } catch {
    error.value = 'Failed to load customers'
  }
}

async function archive(id: number) {
  await http.delete(`/admin/customers/${id}`)
  loadCustomers()
}

async function restore(id: number) {
  await http.post(`/admin/customers/${id}/restore`)
  loadCustomers()
}

onMounted(loadCustomers)
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.table th,
.table td {
  padding: 10px;
  border: 1px solid #ddd;
}
.btn,
.btn-sm {
  background: #3b82f6;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
}
.btn-sm {
  font-size: 0.8rem;
  margin-right: 6px;
}
.error {
  color: red;
  margin-top: 10px;
}
.badge.green {
  background: #22c55e;
  padding: 4px;
}
.badge.red {
  background: #ef4444;
  padding: 4px;
}
.danger {
  background: #dc2626;
}
</style>
