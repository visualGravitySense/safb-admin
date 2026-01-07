<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Gallery Management</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">Add Image</el-button>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in galleryItems" :key="index" style="margin-bottom: 20px">
          <el-card class="gallery-item">
            <el-image
              :src="getImageUrl(item.image)"
              style="width: 100%; height: 200px"
              fit="cover"
            />
            <div style="padding: 10px">
              <h4>{{ item.title || 'Untitled' }}</h4>
              <el-text type="info" size="small">{{ item.category }}</el-text>
              <div style="margin-top: 10px">
                <el-button size="small" @click="handleEdit(item, index)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(index)">Delete</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingIndex === -1 ? 'Add Image' : 'Edit Image'"
      width="600px"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="Image">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :data="{ field: 'image' }"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :show-file-list="false"
            accept="image/*"
            name="image"
          >
            <el-button type="primary" :icon="Upload">Upload Image</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png/gif/webp files with a size less than 10MB
              </div>
            </template>
          </el-upload>
          <div v-if="form.image" style="margin-top: 10px">
            <el-image
              :src="getImageUrl(form.image)"
              style="width: 200px; height: 150px; border-radius: 4px"
              fit="cover"
            />
            <div style="margin-top: 5px">
              <el-button size="small" type="danger" @click="form.image = ''">Remove</el-button>
            </div>
          </div>
          <el-input
            v-model="form.image"
            placeholder="Or enter image URL"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="Events" value="events" />
            <el-option label="Instruments" value="instruments" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Views">
          <el-input-number v-model="form.views" :min="0" />
        </el-form-item>
        <el-form-item label="Likes">
          <el-input-number v-model="form.likes" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-api-url.com/api'  // Замените на ваш production API URL
    : 'http://localhost:3000/api')
// Remove /api from base URL and add /api/upload
const baseUrl = API_BASE_URL.replace('/api', '') || 'http://localhost:3000'
const uploadUrl = `${baseUrl}/api/upload`

const contentStore = useContentStore()
const dialogVisible = ref(false)
const editingIndex = ref(-1)

const galleryItems = computed(() => {
  const gallery = contentStore.content?.gallery
  return Array.isArray(gallery) ? gallery : []
})

const form = reactive({
  image: '',
  title: '',
  category: 'events',
  views: 0,
  likes: 0
})

const handleAdd = () => {
  editingIndex.value = -1
  Object.assign(form, {
    image: '',
    title: '',
    category: 'events',
    views: 0,
    likes: 0
  })
  dialogVisible.value = true
}

const handleEdit = (item, index) => {
  editingIndex.value = index
  Object.assign(form, { ...item })
  dialogVisible.value = true
}

const handleDelete = async (index) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this image?', 'Confirm Delete', {
      type: 'warning'
    })
    const currentGallery = galleryItems.value || []
    const newGallery = [...currentGallery]
    newGallery.splice(index, 1)
    await contentStore.saveContent('gallery', newGallery)
    ElMessage.success('Image deleted successfully')
  } catch {
    // User cancelled
  }
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // If it starts with /uploads, it's a local file
  if (imagePath.startsWith('/uploads')) {
    const apiBaseUrl = API_BASE_URL.replace('/api', '') || 
      (import.meta.env.PROD ? 'https://your-api-url.com' : 'http://localhost:3000')
    return `${apiBaseUrl}${imagePath}`
  }
  // Otherwise return as is (might be relative path)
  return imagePath
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('Upload file must be an image!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('Image size must be smaller than 10MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response.success) {
    form.image = response.data.url
    ElMessage.success('Image uploaded successfully!')
  } else {
    ElMessage.error(response.error || 'Upload failed')
  }
}

const handleUploadError = (error) => {
  console.error('Upload error:', error)
  ElMessage.error('Image upload failed. Please try again.')
}

const handleSave = async () => {
  try {
    const currentGallery = galleryItems.value || []
    const newGallery = [...currentGallery]
    if (editingIndex.value === -1) {
      newGallery.push({ ...form })
    } else {
      newGallery[editingIndex.value] = { ...form }
    }
    await contentStore.saveContent('gallery', newGallery)
    dialogVisible.value = false
    ElMessage.success('Image saved successfully')
  } catch (error) {
    console.error('Error saving image:', error)
    ElMessage.error('Failed to save image. Please try again.')
  }
}

onMounted(() => {
  contentStore.loadContent().catch(error => {
    console.error('Error loading content:', error)
  })
})
</script>

<style scoped>
.content-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.gallery-item {
  height: 100%;
}

.gallery-item h4 {
  margin: 0 0 5px 0;
  color: #303133;
}
</style>
