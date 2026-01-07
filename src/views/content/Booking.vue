<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Booking Form Settings</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="200px">
        <el-form-item label="Enable Booking Form">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        
        <el-divider />
        
        <h3>Form Options</h3>
        
        <el-form-item label="Response Time">
          <el-input v-model="form.responseTime" placeholder="24h" />
        </el-form-item>
        
        <el-form-item label="Default Message">
          <el-input
            v-model="form.defaultMessage"
            type="textarea"
            :rows="3"
            placeholder="Täida lihtne vorm ja saame sinuga ühendust 24 tunni jooksul!"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">
            Save Settings
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { ElMessage } from 'element-plus'

const contentStore = useContentStore()
const loading = ref(false)

const form = reactive({
  enabled: true,
  responseTime: '24h',
  defaultMessage: ''
})

const loadData = () => {
  const booking = contentStore.content.booking
  form.enabled = booking.enabled !== false
  form.responseTime = booking.responseTime || '24h'
  form.defaultMessage = booking.defaultMessage || ''
}

const handleSave = async () => {
  loading.value = true
  const success = await contentStore.saveContent('booking', form)
  if (success) {
    ElMessage.success('Booking settings updated successfully!')
  } else {
    ElMessage.error('Failed to save changes')
  }
  loading.value = false
}

onMounted(() => {
  contentStore.loadContent().then(() => {
    loadData()
  })
})
</script>

<style scoped>
.content-page {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}
</style>
