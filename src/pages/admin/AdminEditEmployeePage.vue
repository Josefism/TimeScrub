<template>
  <div>
    <h1>Edit Employee</h1>

    <form @submit.prevent="save" class="form">
      <label>Name</label>
      <input v-model="name" required />

      <label>Email</label>
      <input v-model="email" type="email" required disabled />

      <label>Role</label>
      <select v-model="role" required>
        <option value="EMPLOYEE">Employee</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button type="submit">Save Changes</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const name = ref('')
const email = ref('')
const role = ref('EMPLOYEE')
const error = ref('')

async function load() {
  try {
    const res = await http.get(`/admin/employees`)
    const emp = res.data.find((e: any) => e.id === id)

    if (!emp) {
      error.value = 'Employee not found'
      return
    }

    name.value = emp.name
    email.value = emp.email
    role.value = emp.role
  } catch {
    error.value = 'Failed to load employee'
  }
}

async function save() {
  error.value = ''

  try {
    await http.put(`/admin/employees/${id}`, {
      name: name.value,
      role: role.value,
    })

    router.push('/admin/employees')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save employee'
  }
}

onMounted(load)
</script>

<style scoped>
.form {
  display: flex;
  gap: 10px;
  flex-direction: column;
  max-width: 400px;
}
.error {
  color: red;
}
</style>
