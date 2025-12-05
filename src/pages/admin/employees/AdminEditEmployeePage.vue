<template>
  <div>
    <h1>Edit Employee</h1>

    <EmployeeForm v-model="form" submitText="Save Changes" :isCreate="false" @submit="onSubmit" />

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

import EmployeeForm from '@/components/admin/employees/EmployeeForm.vue'
import type { Employee, EmployeeFormModel, EmployeePayload } from '@/types/Employee'

const route = useRoute()
const router = useRouter()
const error = ref('')

// Must initialize the required shape so v-model is properly typed
const form = ref<EmployeeFormModel & { deletedAt?: string | null }>({
  name: '',
  email: '',
  role: 'EMPLOYEE',
  password: '',
  deletedAt: null,
})

async function load() {
  try {
    const res = await http.get('/admin/employees')
    const id = Number(route.params.id)

    const found: Employee | undefined = res.data.find((e: Employee) => e.id === id)

    if (!found) {
      error.value = 'Employee not found'
      return
    }

    form.value = {
      name: found.name,
      email: found.email,
      role: found.role,
      password: '', // edit page never fills existing password
      deletedAt: found.deletedAt,
    }
  } catch {
    error.value = 'Failed to load employee'
  }
}

async function onSubmit(payload: EmployeePayload) {
  try {
    await http.put(`/admin/employees/${route.params.id}`, payload)
    router.push('/admin/employees')
  } catch {
    error.value = 'Failed to update employee'
  }
}

async function archive() {
  try {
    await http.delete(`/admin/employees/${route.params.id}`)
    await load()
  } catch {
    error.value = 'Failed to archive employee'
  }
}

async function restore() {
  try {
    await http.post(`/admin/employees/${route.params.id}/restore`)
    await load()
  } catch {
    error.value = 'Failed to restore employee'
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
.danger {
  background: #dc2626;
  color: white;
}
</style>
