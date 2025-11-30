<template>
  <div class="employee-layout">
    <header style="padding: 1rem; border-bottom: 1px solid #ddd">
      <h1>TimeScrub — Employee</h1>
      <nav>
        <router-link to="/">Jobs</router-link>
        <router-link to="/history">History</router-link>
      </nav>
      <div style="position: absolute; top: 1rem; right: 1rem">
        <UserMenu />
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import UserMenu from '@/components/UserMenu.vue'
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}
</style>
