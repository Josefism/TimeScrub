import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as { id: string; name: string; role: 'employee' | 'admin' } | null,
  }),

  actions: {
    login(token: string, user: any) {
      this.token = token
      this.user = user
    },

    logout() {
      this.token = null
      this.user = null
    },
  },

  persist: true,
})
