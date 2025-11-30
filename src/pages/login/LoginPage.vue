<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="onSubmit">
      <label>Email</label>
      <input v-model="email" type="email" />

      <label>Password</label>
      <input v-model="password" type="password" />

      <button type="submit">Login</button>
    </form>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import http from '@/api/http'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''

  try {
    const response = await http.post('/login', {
      email: email.value,
      password: password.value,
    })

    auth.login(response.data.token, response.data.user)

    // Redirect after login according to role
    if (response.data.user.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/history')
    }
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Login failed.'
  }
}
</script>
