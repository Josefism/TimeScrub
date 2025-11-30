import http from '@/api/http'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as {
      id: string
      name: string
      role: 'ADMIN' | 'EMPLOYEE'
      companyId: number
    } | null,
  }),

  actions: {
    login(token: string, user: any) {
      this.token = token
      this.user = user

      http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    logout() {
      this.token = null
      this.user = null
      delete http.defaults.headers.common['Authorization']
    },
  },

  persist: true,
})
