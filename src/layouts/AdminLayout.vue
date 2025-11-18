<template>
  <div class="admin-layout">
    <header style="padding: 1rem; border-bottom: 1px solid #ddd">
      <h1>TimeScrub — Admin</h1>
      <nav style="margin-top: 0.5rem; display: flex; gap: 1rem">
        <router-link to="/admin">Dashboard</router-link>
        <router-link to="/admin/jobs">Jobs</router-link>
        <router-link to="/admin/entries">Entries</router-link>
        <router-link to="/">Employee View</router-link>
      </nav>
    </header>

    <main style="padding: 1rem">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
