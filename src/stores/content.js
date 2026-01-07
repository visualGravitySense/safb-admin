import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useContentStore = defineStore('content', () => {
  const content = ref({
    hero: {
      title: 'SIIM AIMLA FUNK BAND',
      subtitle: 'Funk, mis paneb sind tantsima',
      description: 'Tipptasemel live-muusika, mis loob unustamatu elamuse teie üritusele',
      ctaPrimary: 'Broneeri Nüüd',
      ctaSecondary: 'Kuula Muusikat',
      stats: {
        viewers: '50K+',
        viewersLabel: 'Vaatajat',
        experience: '8+',
        experienceLabel: 'Aastat Kogemust'
      }
    },
    about: {
      title: 'Bändist',
      description: 'Siim Aimla Funk Band on see, mis muudab iga ürituse peoks. James Brown\'i energia, Michael Breckeri vibe ja eesti popiklassika, mida keegi ei oska oodata – kõik ühes paketis.',
      members: []
    },
    events: [],
    music: {
      videos: [],
      albums: [],
      spotifyLink: '',
      youtubeLink: ''
    },
    gallery: [],
    stats: {
      events: 200,
      viewers: 50,
      years: 8,
      albums: 2
    },
    booking: {
      enabled: true
    }
  })

  const loading = ref(false)
  const error = ref(null)
  
  // API base URL - для GitHub Pages используйте полный URL вашего API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://your-api-url.com/api'  // Замените на ваш production API URL
      : 'http://localhost:3000/api')

  // Load content from API
  const loadContent = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE_URL}/content`)
      if (response.data.success) {
        const loadedData = response.data.data
        // Ensure gallery is always an array
        if (loadedData.gallery && !Array.isArray(loadedData.gallery)) {
          loadedData.gallery = []
        }
        // Ensure events is always an array
        if (loadedData.events && !Array.isArray(loadedData.events)) {
          loadedData.events = []
        }
        // Ensure members is always an array
        if (loadedData.about?.members && !Array.isArray(loadedData.about.members)) {
          loadedData.about.members = []
        }
        content.value = { ...content.value, ...loadedData }
      } else {
        throw new Error(response.data.error || 'Failed to load content')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error loading content:', err)
      // Fallback to localStorage if API fails
      try {
        const saved = localStorage.getItem('saf_content')
        if (saved) {
          const parsed = JSON.parse(saved)
          // Ensure arrays are arrays
          if (parsed.gallery && !Array.isArray(parsed.gallery)) {
            parsed.gallery = []
          }
          if (parsed.events && !Array.isArray(parsed.events)) {
            parsed.events = []
          }
          if (parsed.about?.members && !Array.isArray(parsed.about.members)) {
            parsed.about.members = []
          }
          content.value = { ...content.value, ...parsed }
          console.warn('Loaded from localStorage fallback')
        }
      } catch (localErr) {
        console.error('LocalStorage fallback also failed:', localErr)
      }
    } finally {
      loading.value = false
    }
  }

  // Save content to API
  const saveContent = async (section, data) => {
    loading.value = true
    error.value = null
    try {
      // Update local state first for immediate UI update
      // Handle arrays differently from objects
      if (Array.isArray(data)) {
        content.value[section] = data
      } else {
        content.value[section] = { ...content.value[section], ...data }
      }
      
      // Save to API
      const response = await axios.put(`${API_BASE_URL}/content/${section}`, data)
      
      if (response.data.success) {
        // Update with server response
        content.value[section] = response.data.data
        return true
      } else {
        throw new Error(response.data.error || 'Failed to save content')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error saving content:', err)
      
      // Fallback to localStorage if API fails
      try {
        localStorage.setItem('saf_content', JSON.stringify(content.value))
        console.warn('Saved to localStorage fallback')
        return true
      } catch (localErr) {
        console.error('LocalStorage fallback also failed:', localErr)
        return false
      }
    } finally {
      loading.value = false
    }
  }

  return {
    content,
    loading,
    error,
    loadContent,
    saveContent
  }
})
