import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  // Simple authentication - in production, use proper auth
  const login = (username, password) => {
    // Get credentials from environment or use defaults
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'SAFunk2024!Admin#Secure'
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      user.value = { username }
      localStorage.setItem('auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('auth')
  }

  const checkAuth = () => {
    const auth = localStorage.getItem('auth')
    if (auth === 'true') {
      isAuthenticated.value = true
      user.value = { username: 'admin' }
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth
  }
})
