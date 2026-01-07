<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Welcome to SAF Dashboard</span>
            </div>
          </template>
          <p>Manage your website content easily from this dashboard.</p>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" v-for="item in quickLinks" :key="item.path">
        <el-card class="quick-link-card" @click="$router.push(item.path)">
          <div class="quick-link-content">
            <el-icon :size="40" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const quickLinks = ref([
  {
    path: '/hero',
    title: 'Hero Section',
    description: 'Edit main landing content',
    icon: 'Star',
    color: '#409eff'
  },
  {
    path: '/events',
    title: 'Events',
    description: 'Manage concerts & events',
    icon: 'Calendar',
    color: '#67c23a'
  },
  {
    path: '/about',
    title: 'Band Members',
    description: 'Update member information',
    icon: 'User',
    color: '#e6a23c'
  },
  {
    path: '/gallery',
    title: 'Gallery',
    description: 'Manage photos',
    icon: 'Picture',
    color: '#f56c6c'
  }
])
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.quick-link-card {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-link-content {
  text-align: center;
  padding: 20px;
}

.quick-link-content h3 {
  margin: 16px 0 8px 0;
  color: #303133;
}

.quick-link-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
