<template>
  <div class="preview-container">
    <div class="preview-header">
      <div class="preview-controls">
        <el-button @click="handleClose" :icon="Close">Close Preview</el-button>
        <el-button type="primary" @click="handleOpenInNewTab" :icon="Link">Open in New Tab</el-button>
        <el-button @click="handleRefresh" :icon="Refresh">Refresh</el-button>
      </div>
      <div class="preview-info">
        <el-tag type="info">Preview Mode - Changes are not saved yet</el-tag>
      </div>
    </div>
    <div class="preview-iframe-container">
      <iframe
        ref="previewIframe"
        :src="previewUrl"
        class="preview-iframe"
        frameborder="0"
        @load="handleIframeLoad"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { Close, Link, Refresh } from '@element-plus/icons-vue'

const router = useRouter()
const contentStore = useContentStore()
const previewIframe = ref(null)

// Watch for content changes and update preview
watch(() => contentStore.content, () => {
  saveContentForPreview()
  // Try to send update to iframe
  if (previewIframe.value && previewIframe.value.contentWindow) {
    try {
      previewIframe.value.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        data: contentStore.content
      }, REACT_SITE_URL)
    } catch (error) {
      // Ignore cross-origin errors
    }
  }
}, { deep: true })

// Get React site URL from environment or use default
const REACT_SITE_URL = import.meta.env.VITE_REACT_SITE_URL || 
  (import.meta.env.PROD 
    ? 'https://your-react-site.com'  // Замените на ваш production React сайт URL
    : 'http://localhost:5173')

const previewUrl = computed(() => {
  // Add preview mode parameter
  return `${REACT_SITE_URL}?preview=true&t=${Date.now()}`
})

const handleClose = () => {
  router.back()
}

const handleOpenInNewTab = () => {
  window.open(previewUrl.value, '_blank')
}

const handleRefresh = () => {
  if (previewIframe.value) {
    // Save current content to localStorage for preview
    saveContentForPreview()
    previewIframe.value.src = previewUrl.value
  }
}

const saveContentForPreview = () => {
  try {
    // Save current content state to localStorage so React site can read it
    const previewData = {
      ...contentStore.content,
      _preview: true,
      _timestamp: Date.now()
    }
    localStorage.setItem('saf_content_preview', JSON.stringify(previewData))
  } catch (error) {
    console.error('Error saving preview data:', error)
  }
}

const handleIframeLoad = () => {
  // Send content data to iframe via postMessage
  try {
    if (previewIframe.value && previewIframe.value.contentWindow) {
      saveContentForPreview()
      // Also try to send via postMessage
      previewIframe.value.contentWindow.postMessage({
        type: 'PREVIEW_DATA',
        data: contentStore.content
      }, REACT_SITE_URL)
    }
  } catch (error) {
    console.error('Error sending preview data:', error)
  }
}

let previewInterval = null

onMounted(() => {
  // Save content for preview when component mounts
  saveContentForPreview()
  
  // Also save periodically to catch any changes
  previewInterval = setInterval(() => {
    saveContentForPreview()
  }, 2000)
})

onUnmounted(() => {
  if (previewInterval) {
    clearInterval(previewInterval)
  }
})
</script>

<style scoped>
.preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.preview-header {
  background: #fff;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-controls {
  display: flex;
  gap: 10px;
}

.preview-info {
  display: flex;
  align-items: center;
}

.preview-iframe-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}
</style>
