<template>
  <div>
    <h2>Create Employee</h2>

    <form @submit.prevent="onSubmit" class="form">
      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Name</label>
      <input v-model="name" required />

      <label>Password</label>
      <input v-model="password" type="password" required />

      <label>Role</label>
      <select v-model="role" required>
        <option value="EMPLOYEE">Employee</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button type="submit">Create Employee</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

const router = useRouter()

const email = ref('')
const name = ref('')
const password = ref('')
const role = ref('EMPLOYEE')
const error = ref('')

async function onSubmit() {
  error.value = ''

  try {
    await http.post('/admin/employees', {
      email: email.value,
      name: name.value,
      password: password.value,
      role: role.value,
    })

    router.push('/admin') // back to dashboard
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error creating employee'
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}
.error {
  color: red;
}
</style>
