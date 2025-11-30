<template>
  <div class="user-menu" ref="menuRef">
    <!-- Avatar Button -->
    <button class="avatar-btn" @click="toggle">
      <div class="avatar">{{ initials }}</div>
    </button>

    <!-- Dropdown -->
    <div v-if="open" class="dropdown">
      <div class="user-info">
        <strong>{{ auth.user?.name }}</strong>
        <small>{{ auth.user?.role }}</small>
      </div>

      <hr />

      <button class="logout-btn" @click="onLogout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const initials = computed(() => {
  if (!auth.user?.name) return '?'
  return auth.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onLogout() {
  auth.logout()
  router.push('/login')
}

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: relative;
  display: inline-block;
}

/* Avatar circle */
.avatar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

/* Dropdown */
.dropdown {
  position: absolute;
  right: 0;
  top: 46px;
  width: 180px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  padding: 10px;
  z-index: 10;
}

.user-info {
  margin-bottom: 8px;
}

.logout-btn {
  width: 100%;
  background: #ef4444;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #dc2626;
}
</style>
