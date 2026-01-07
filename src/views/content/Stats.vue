<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Statistics Management</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="200px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Events Count">
              <el-input-number v-model="form.events" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Viewers (K)">
              <el-input-number v-model="form.viewers" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Years">
              <el-input-number v-model="form.years" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Albums">
              <el-input-number v-model="form.albums" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">
            Save Changes
          </el-button>
          <el-button @click="handleReset">Reset</el-button>
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
  events: 0,
  viewers: 0,
  years: 0,
  albums: 0
})

const loadData = () => {
  const stats = contentStore.content.stats
  form.events = stats.events || 0
  form.viewers = stats.viewers || 0
  form.years = stats.years || 0
  form.albums = stats.albums || 0
}

const handleSave = async () => {
  loading.value = true
  const success = await contentStore.saveContent('stats', form)
  if (success) {
    ElMessage.success('Statistics updated successfully!')
  } else {
    ElMessage.error('Failed to save changes')
  }
  loading.value = false
}

const handleReset = () => {
  loadData()
  ElMessage.info('Form reset to saved values')
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
</style>
