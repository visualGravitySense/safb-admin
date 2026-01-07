<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>About Section & Band Members</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="200px">
        <el-form-item label="Section Title">
          <el-input v-model="form.title" />
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSaveAbout">Save About Section</el-button>
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <div class="members-section">
        <div class="section-header">
          <h3>Band Members</h3>
          <el-button type="primary" :icon="Plus" @click="handleAddMember">Add Member</el-button>
        </div>
        
        <el-table :data="members" style="width: 100%; margin-top: 20px">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="instrument" label="Instrument" />
          <el-table-column prop="role" label="Role" />
          <el-table-column label="Photo" width="100">
            <template #default="scope">
              <el-image
                v-if="scope.row.photo"
                :src="getImageUrl(scope.row.photo)"
                style="width: 60px; height: 60px; border-radius: 50%"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="150">
            <template #default="scope">
              <el-button size="small" @click="handleEditMember(scope.row, scope.$index)">Edit</el-button>
              <el-button size="small" type="danger" @click="handleDeleteMember(scope.$index)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- Member Dialog -->
    <el-dialog
      v-model="memberDialogVisible"
      :title="editingMemberIndex === -1 ? 'Add Member' : 'Edit Member'"
      width="600px"
    >
      <el-form :model="memberForm" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="memberForm.name" />
        </el-form-item>
        <el-form-item label="Instrument">
          <el-input v-model="memberForm.instrument" />
        </el-form-item>
        <el-form-item label="Role">
          <el-input v-model="memberForm.role" placeholder="e.g., Bändiliider" />
        </el-form-item>
        <el-form-item label="Photo">
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
            <el-button type="primary" :icon="Upload">Upload Photo</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png/gif/webp files with a size less than 10MB
              </div>
            </template>
          </el-upload>
          <div v-if="memberForm.photo" style="margin-top: 10px">
            <el-image
              :src="getImageUrl(memberForm.photo)"
              style="width: 100px; height: 100px; border-radius: 50%"
              fit="cover"
            />
            <div style="margin-top: 5px">
              <el-button size="small" type="danger" @click="memberForm.photo = ''">Remove</el-button>
            </div>
          </div>
          <el-input
            v-model="memberForm.photo"
            placeholder="Or enter image URL"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="Experience">
          <el-input v-model="memberForm.experience" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="Highlight">
          <el-input v-model="memberForm.highlight" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="memberDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveMember">Save</el-button>
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
const memberDialogVisible = ref(false)
const editingMemberIndex = ref(-1)

const form = reactive({
  title: '',
  description: ''
})

const members = computed(() => contentStore.content.about?.members || [])

const memberForm = ref({
  name: '',
  instrument: '',
  role: '',
  photo: '',
  experience: '',
  highlight: ''
})

const loadData = () => {
  const about = contentStore.content.about
  form.title = about.title || ''
  form.description = about.description || ''
}

const handleSaveAbout = async () => {
  try {
    await contentStore.saveContent('about', form)
    ElMessage.success('About section saved successfully!')
  } catch (error) {
    console.error('Error saving about section:', error)
    ElMessage.error('Failed to save about section. Please try again.')
  }
}

const handleAddMember = () => {
  editingMemberIndex.value = -1
  memberForm.value = {
    name: '',
    instrument: '',
    role: '',
    photo: '',
    experience: '',
    highlight: ''
  }
  memberDialogVisible.value = true
}

const handleEditMember = (member, index) => {
  editingMemberIndex.value = index
  memberForm.value = { ...member }
  memberDialogVisible.value = true
}

const handleDeleteMember = async (index) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this member?', 'Confirm Delete', {
      type: 'warning'
    })
    const newMembers = [...members.value]
    newMembers.splice(index, 1)
    await contentStore.saveContent('about', {
      ...contentStore.content.about,
      members: newMembers
    })
    ElMessage.success('Member deleted successfully')
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
    memberForm.value.photo = response.data.url
    ElMessage.success('Photo uploaded successfully!')
  } else {
    ElMessage.error(response.error || 'Upload failed')
  }
}

const handleUploadError = (error) => {
  console.error('Upload error:', error)
  ElMessage.error('Photo upload failed. Please try again.')
}

const handleSaveMember = async () => {
  try {
    const newMembers = [...members.value]
    if (editingMemberIndex.value === -1) {
      newMembers.push({ ...memberForm.value })
    } else {
      newMembers[editingMemberIndex.value] = { ...memberForm.value }
    }
    await contentStore.saveContent('about', {
      ...contentStore.content.about,
      members: newMembers
    })
    memberDialogVisible.value = false
    ElMessage.success('Member saved successfully')
  } catch (error) {
    console.error('Error saving member:', error)
    ElMessage.error('Failed to save member. Please try again.')
  }
}

onMounted(() => {
  contentStore.loadContent().then(() => {
    loadData()
  })
})
</script>

<style scoped>
.content-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.members-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #303133;
}
</style>
