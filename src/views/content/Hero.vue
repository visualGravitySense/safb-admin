<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Hero Section Management</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="200px" @submit.prevent="handleSave">
        <el-form-item label="Main Title">
          <el-input v-model="form.title" placeholder="SIIM AIMLA FUNK BAND" />
        </el-form-item>
        
        <el-form-item label="Subtitle">
          <el-input v-model="form.subtitle" placeholder="Funk, mis paneb sind tantsima" />
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Tipptasemel live-muusika, mis loob unustamatu elamuse teie üritusele"
          />
        </el-form-item>
        
        <el-divider />
        
        <h3>CTA Buttons</h3>
        
        <el-form-item label="Primary Button Text">
          <el-input v-model="form.ctaPrimary" placeholder="Broneeri Nüüd" />
        </el-form-item>
        
        <el-form-item label="Secondary Button Text">
          <el-input v-model="form.ctaSecondary" placeholder="Kuula Muusikat" />
        </el-form-item>
        
        <el-divider />
        
        <h3>Statistics Badges</h3>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Viewers Count">
              <el-input v-model="form.stats.viewers" placeholder="50K+" />
            </el-form-item>
            <el-form-item label="Viewers Label">
              <el-input v-model="form.stats.viewersLabel" placeholder="Vaatajat" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Experience">
              <el-input v-model="form.stats.experience" placeholder="8+" />
            </el-form-item>
            <el-form-item label="Experience Label">
              <el-input v-model="form.stats.experienceLabel" placeholder="Aastat Kogemust" />
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
  title: '',
  subtitle: '',
  description: '',
  ctaPrimary: '',
  ctaSecondary: '',
  stats: {
    viewers: '',
    viewersLabel: '',
    experience: '',
    experienceLabel: ''
  }
})

const loadData = () => {
  const hero = contentStore.content.hero
  form.title = hero.title || ''
  form.subtitle = hero.subtitle || ''
  form.description = hero.description || ''
  form.ctaPrimary = hero.ctaPrimary || ''
  form.ctaSecondary = hero.ctaSecondary || ''
  form.stats = { ...hero.stats }
}

const handleSave = async () => {
  loading.value = true
  const success = await contentStore.saveContent('hero', form)
  if (success) {
    ElMessage.success('Hero section updated successfully!')
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

h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}
</style>
