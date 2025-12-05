<template>
  <div>
    <h1>Create Employee</h1>

    <EmployeeForm v-model="form" submitText="Create Employee" :isCreate="true" @submit="onSubmit" />

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

import EmployeeForm from '@/components/admin/employees/EmployeeForm.vue'
import type { EmployeePayload, EmployeeFormModel } from '@/types/Employee'

const router = useRouter()
const error = ref('')

// Form local model (required because EmployeeForm expects modelValue)
const form = ref<EmployeeFormModel>({
  name: '',
  email: '',
  role: 'EMPLOYEE',
  password: '', // required only on create
})

async function onSubmit(payload: EmployeePayload) {
  try {
    await http.post('/admin/employees', payload)
    router.push('/admin/employees')
  } catch {
    error.value = 'Failed to create employee'
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
</style>
