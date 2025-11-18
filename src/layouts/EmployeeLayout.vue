<template>
  <div class="employee-layout">
    <nav>
      <router-link to="/">Jobs</router-link>
      <router-link to="/history">History</router-link>
      <button @click="logout">Logout</button>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
function logout() {
  auth.logout()
}
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}
</style>
