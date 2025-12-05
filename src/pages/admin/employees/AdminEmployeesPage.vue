<template>
  <div>
    <h1>Employees</h1>

    <router-link class="btn" to="/admin/employees/create"> + Add Employee </router-link>

    <label class="checkbox">
      <input type="checkbox" v-model="showArchived" @change="loadEmployees" />
      Show archived
    </label>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th style="width: 200px"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="emp in employees" :key="emp.id">
          <td>{{ emp.name }}</td>
          <td>{{ emp.email }}</td>
          <td>{{ emp.role }}</td>

          <td>
            <span v-if="emp.deletedAt" class="badge red">Archived</span>
            <span v-else class="badge green">Active</span>
          </td>

          <td>
            <router-link class="btn-sm" :to="`/admin/employees/${emp.id}/edit`"> Edit </router-link>

            <button v-if="!emp.deletedAt" class="btn-sm danger" @click="archive(emp.id)">
              Archive
            </button>

            <button v-else class="btn-sm" @click="restore(emp.id)">Restore</button>
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
import type { Employee } from '@/types/Employee'

const employees = ref<Employee[]>([])
const showArchived = ref(false)
const error = ref('')

async function loadEmployees() {
  try {
    const res = await http.get('/admin/employees', {
      params: { showArchived: showArchived.value },
    })
    employees.value = res.data as Employee[]
  } catch {
    error.value = 'Failed to load employees'
  }
}

async function archive(id: number) {
  await http.delete(`/admin/employees/${id}`)
  loadEmployees()
}

async function restore(id: number) {
  await http.post(`/admin/employees/${id}/restore`)
  loadEmployees()
}

onMounted(loadEmployees)
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
.error {
  color: red;
  margin-top: 1rem;
}
</style>
