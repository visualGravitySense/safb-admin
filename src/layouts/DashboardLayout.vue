<template>
  <el-container class="dashboard-container">
    <el-aside width="250px" class="sidebar">
      <div class="logo">
        <h2>SAF Dashboard</h2>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/">
          <el-icon><DataBoard /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        
        <el-menu-item index="/hero">
          <el-icon><Star /></el-icon>
          <span>Hero Section</span>
        </el-menu-item>
        
        <el-menu-item index="/about">
          <el-icon><User /></el-icon>
          <span>About / Members</span>
        </el-menu-item>
        
        <el-menu-item index="/events">
          <el-icon><Calendar /></el-icon>
          <span>Events</span>
        </el-menu-item>
        
        <el-menu-item index="/music">
          <el-icon><VideoPlay /></el-icon>
          <span>Music</span>
        </el-menu-item>
        
        <el-menu-item index="/gallery">
          <el-icon><Picture /></el-icon>
          <span>Gallery</span>
        </el-menu-item>
        
        <el-menu-item index="/stats">
          <el-icon><DataAnalysis /></el-icon>
          <span>Statistics</span>
        </el-menu-item>
        
        <el-menu-item index="/booking">
          <el-icon><EditPen /></el-icon>
          <span>Booking Settings</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h3>{{ pageTitle }}</h3>
          <div class="header-actions">
            <el-button
              v-if="route.path !== '/preview'"
              type="primary"
              :icon="View"
              @click="handlePreview"
            >
              Preview
            </el-button>
            <el-button
              type="danger"
              @click="handleLogout"
            >
              Logout
            </el-button>
          </div>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import { View } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/hero': 'Hero Section',
    '/about': 'About / Members',
    '/events': 'Events',
    '/music': 'Music',
    '/gallery': 'Gallery',
    '/stats': 'Statistics',
    '/booking': 'Booking Settings',
    '/preview': 'Preview'
  }
  return titles[route.path] || 'Dashboard'
})

onMounted(() => {
  authStore.checkAuth()
})

const handlePreview = () => {
  router.push('/preview')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout?',
      'Confirm Logout',
      {
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    authStore.logout()
    router.push('/login')
  } catch {
    // User cancelled
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.sidebar {
  background: #304156;
  color: #fff;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.sidebar-menu {
  border: none;
  background: #304156;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-menu .el-menu-item.is-active {
  background: #409eff;
  color: #fff;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.main-content {
  background: #f5f5f5;
  padding: 20px;
}
</style>
