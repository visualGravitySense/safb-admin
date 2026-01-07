import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'hero',
        name: 'Hero',
        component: () => import('@/views/content/Hero.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/content/About.vue')
      },
      {
        path: 'events',
        name: 'Events',
        component: () => import('@/views/content/Events.vue')
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('@/views/content/Music.vue')
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: () => import('@/views/content/Gallery.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('@/views/content/Stats.vue')
      },
      {
        path: 'booking',
        name: 'Booking',
        component: () => import('@/views/content/Booking.vue')
      },
      {
        path: 'preview',
        name: 'Preview',
        component: () => import('@/views/Preview.vue')
      }
    ]
  }
]

// Get base path from environment or use default
const base = import.meta.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(base),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
