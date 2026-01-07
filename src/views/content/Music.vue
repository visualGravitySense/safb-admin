<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Music Section Management</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="YouTube Videos" name="videos">
          <div class="section-header">
            <h3>YouTube Videos</h3>
            <el-button type="primary" :icon="Plus" @click="handleAddVideo">Add Video</el-button>
          </div>
          
          <el-table :data="videos" style="width: 100%; margin-top: 20px">
            <el-table-column label="Video ID" prop="id" />
            <el-table-column label="Preview" width="200">
              <template #default="scope">
                <el-image
                  :src="`https://img.youtube.com/vi/${scope.row.id}/mqdefault.jpg`"
                  style="width: 100%; height: 120px"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="150">
              <template #default="scope">
                <el-button size="small" @click="handleEditVideo(scope.row, scope.$index)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDeleteVideo(scope.$index)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="Albums" name="albums">
          <div class="section-header">
            <h3>Albums</h3>
            <el-button type="primary" :icon="Plus" @click="handleAddAlbum">Add Album</el-button>
          </div>
          
          <el-table :data="albums" style="width: 100%; margin-top: 20px">
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="year" label="Year" width="100" />
            <el-table-column prop="description" label="Description" />
            <el-table-column label="Actions" width="150">
              <template #default="scope">
                <el-button size="small" @click="handleEditAlbum(scope.row, scope.$index)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDeleteAlbum(scope.$index)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="Streaming Links" name="links">
          <el-form :model="linksForm" label-width="200px">
            <el-form-item label="Spotify Link">
              <el-input v-model="linksForm.spotifyLink" placeholder="https://open.spotify.com/..." />
            </el-form-item>
            <el-form-item label="YouTube Channel Link">
              <el-input v-model="linksForm.youtubeLink" placeholder="https://www.youtube.com/..." />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveLinks">Save Links</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- Video Dialog -->
    <el-dialog
      v-model="videoDialogVisible"
      :title="editingVideoIndex === -1 ? 'Add Video' : 'Edit Video'"
      width="500px"
    >
      <el-form :model="videoForm" label-width="100px">
        <el-form-item label="Video ID">
          <el-input v-model="videoForm.id" placeholder="YouTube video ID (e.g., i8pk65jrAr4)" />
          <el-text type="info" size="small" style="display: block; margin-top: 5px">
            Extract from YouTube URL: youtube.com/watch?v=VIDEO_ID
          </el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="videoDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveVideo">Save</el-button>
      </template>
    </el-dialog>
    
    <!-- Album Dialog -->
    <el-dialog
      v-model="albumDialogVisible"
      :title="editingAlbumIndex === -1 ? 'Add Album' : 'Edit Album'"
      width="600px"
    >
      <el-form :model="albumForm" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="albumForm.name" />
        </el-form-item>
        <el-form-item label="Year">
          <el-input-number v-model="albumForm.year" :min="1900" :max="2100" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="albumForm.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="albumDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveAlbum">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const contentStore = useContentStore()
const activeTab = ref('videos')
const videoDialogVisible = ref(false)
const albumDialogVisible = ref(false)
const editingVideoIndex = ref(-1)
const editingAlbumIndex = ref(-1)

const videos = computed(() => contentStore.content.music?.videos || [])
const albums = computed(() => contentStore.content.music?.albums || [])

const linksForm = reactive({
  spotifyLink: '',
  youtubeLink: ''
})

const videoForm = ref({
  id: ''
})

const albumForm = ref({
  name: '',
  year: new Date().getFullYear(),
  description: ''
})

const loadData = () => {
  const music = contentStore.content.music
  linksForm.spotifyLink = music.spotifyLink || ''
  linksForm.youtubeLink = music.youtubeLink || ''
}

const handleAddVideo = () => {
  editingVideoIndex.value = -1
  videoForm.value = { id: '' }
  videoDialogVisible.value = true
}

const handleEditVideo = (video, index) => {
  editingVideoIndex.value = index
  videoForm.value = { ...video }
  videoDialogVisible.value = true
}

const handleDeleteVideo = async (index) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this video?', 'Confirm Delete', {
      type: 'warning'
    })
    const newVideos = [...videos.value]
    newVideos.splice(index, 1)
    await contentStore.saveContent('music', {
      ...contentStore.content.music,
      videos: newVideos
    })
    ElMessage.success('Video deleted successfully')
  } catch {
    // User cancelled
  }
}

const handleSaveVideo = async () => {
  const newVideos = [...videos.value]
  if (editingVideoIndex.value === -1) {
    newVideos.push({ ...videoForm.value })
  } else {
    newVideos[editingVideoIndex.value] = { ...videoForm.value }
  }
  await contentStore.saveContent('music', {
    ...contentStore.content.music,
    videos: newVideos
  })
  videoDialogVisible.value = false
  ElMessage.success('Video saved successfully')
}

const handleAddAlbum = () => {
  editingAlbumIndex.value = -1
  albumForm.value = {
    name: '',
    year: new Date().getFullYear(),
    description: ''
  }
  albumDialogVisible.value = true
}

const handleEditAlbum = (album, index) => {
  editingAlbumIndex.value = index
  albumForm.value = { ...album }
  albumDialogVisible.value = true
}

const handleDeleteAlbum = async (index) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this album?', 'Confirm Delete', {
      type: 'warning'
    })
    const newAlbums = [...albums.value]
    newAlbums.splice(index, 1)
    await contentStore.saveContent('music', {
      ...contentStore.content.music,
      albums: newAlbums
    })
    ElMessage.success('Album deleted successfully')
  } catch {
    // User cancelled
  }
}

const handleSaveAlbum = async () => {
  const newAlbums = [...albums.value]
  if (editingAlbumIndex.value === -1) {
    newAlbums.push({ ...albumForm.value })
  } else {
    newAlbums[editingAlbumIndex.value] = { ...albumForm.value }
  }
  await contentStore.saveContent('music', {
    ...contentStore.content.music,
    albums: newAlbums
  })
  albumDialogVisible.value = false
  ElMessage.success('Album saved successfully')
}

const handleSaveLinks = async () => {
  await contentStore.saveContent('music', {
    ...contentStore.content.music,
    spotifyLink: linksForm.spotifyLink,
    youtubeLink: linksForm.youtubeLink
  })
  ElMessage.success('Links saved successfully')
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
