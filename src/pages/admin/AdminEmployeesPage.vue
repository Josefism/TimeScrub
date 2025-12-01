<template>
  <div>
    <h1>Employees</h1>

    <label>
      <input type="checkbox" v-model="showArchived" />
      Show archived employees
    </label>

    <table class="emp-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th style="width: 160px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in filteredEmployees" :key="emp.id">
          <td>{{ emp.name }}</td>
          <td>{{ emp.email }}</td>
          <td>{{ emp.role }}</td>

          <td>
            <span v-if="emp.deletedAt" class="badge archived">Archived</span>
            <span v-else class="badge active">Active</span>
          </td>

          <td>
            <template v-if="!emp.deletedAt">
              <router-link :to="`/admin/employees/${emp.id}/edit`" class="edit-link">
                Edit
              </router-link>

              <button class="archive-btn" @click="archive(emp.id)">Archive</button>
            </template>

            <template v-else>
              <button class="restore-btn" @click="restore(emp.id)">Restore</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/api/http'

interface AdminEmployee {
  id: number
  name: string
  email: string
  role: string
  deletedAt: string | null
}

const employees = ref<AdminEmployee[]>([])
const showArchived = ref(false)
const error = ref('')

async function loadEmployees() {
  error.value = ''
  try {
    const res = await http.get('/admin/employees')
    employees.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load employees'
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

const filteredEmployees = computed(() => {
  if (showArchived.value) return employees.value
  return employees.value.filter((e) => !e.deletedAt)
})

onMounted(loadEmployees)
</script>

<style scoped>
.emp-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.emp-table th,
.emp-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
}
.badge.active {
  background-color: #22c55e;
}
.badge.archived {
  background-color: #ef4444;
}

.edit-link {
  margin-right: 10px;
  color: #2563eb; /* blue-600 */
  text-decoration: underline;
  cursor: pointer;
}
.edit-link:hover {
  color: #1d4ed8; /* blue-700 */
}

.archive-btn,
.restore-btn {
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  color: white;
  border-radius: 4px;
}
.archive-btn {
  background-color: #ef4444;
}
.restore-btn {
  background-color: #3b82f6;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
