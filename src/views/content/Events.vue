<template>
  <div class="content-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Events Management</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">Add Event</el-button>
        </div>
      </template>
      
      <el-table :data="events" style="width: 100%">
        <el-table-column prop="date" label="Date" width="150" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="location" label="Location" />
        <el-table-column prop="price" label="Price" width="120" />
        <el-table-column label="Status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.soldOut ? 'danger' : 'success'">
              {{ scope.row.soldOut ? 'Sold Out' : 'Available' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingIndex === -1 ? 'Add Event' : 'Edit Event'"
      width="600px"
    >
      <el-form :model="eventForm" label-width="120px">
        <el-form-item label="Date">
          <el-date-picker
            v-model="eventForm.date"
            type="date"
            placeholder="Select date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="eventForm.title" />
        </el-form-item>
        <el-form-item label="Location">
          <el-input v-model="eventForm.location" />
        </el-form-item>
        <el-form-item label="Price">
          <el-input v-model="eventForm.price" />
        </el-form-item>
        <el-form-item label="Time">
          <el-input v-model="eventForm.time" placeholder="19:00" />
        </el-form-item>
        <el-form-item label="Duration">
          <el-input v-model="eventForm.duration" placeholder="2h 30min" />
        </el-form-item>
        <el-form-item label="Tickets Left %">
          <el-input-number v-model="eventForm.ticketsLeft" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="Sold Out">
          <el-switch v-model="eventForm.soldOut" />
        </el-form-item>
        <el-form-item label="Popularity">
          <el-select v-model="eventForm.popularity" style="width: 100%">
            <el-option label="High" value="high" />
            <el-option label="Medium" value="medium" />
            <el-option label="Low" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="Attendees">
          <el-input-number v-model="eventForm.attendees" :min="0" />
        </el-form-item>
        <el-form-item label="Ticket Link">
          <el-input v-model="eventForm.ticketLink" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveEvent">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const contentStore = useContentStore()
const dialogVisible = ref(false)
const editingIndex = ref(-1)

const events = computed(() => contentStore.content.events || [])

const eventForm = ref({
  date: '',
  title: '',
  location: '',
  price: '',
  time: '',
  duration: '',
  ticketsLeft: 100,
  soldOut: false,
  popularity: 'medium',
  attendees: 0,
  ticketLink: ''
})

const handleAdd = () => {
  editingIndex.value = -1
  eventForm.value = {
    date: '',
    title: '',
    location: '',
    price: '',
    time: '',
    duration: '',
    ticketsLeft: 100,
    soldOut: false,
    popularity: 'medium',
    attendees: 0,
    ticketLink: ''
  }
  dialogVisible.value = true
}

const handleEdit = (event) => {
  editingIndex.value = events.value.indexOf(event)
  eventForm.value = { ...event }
  dialogVisible.value = true
}

const handleDelete = async (index) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this event?', 'Confirm Delete', {
      type: 'warning'
    })
    const newEvents = [...events.value]
    newEvents.splice(index, 1)
    await contentStore.saveContent('events', newEvents)
    ElMessage.success('Event deleted successfully')
  } catch {
    // User cancelled
  }
}

const handleSaveEvent = async () => {
  try {
    const newEvents = [...events.value]
    if (editingIndex.value === -1) {
      newEvents.push({ ...eventForm.value })
    } else {
      newEvents[editingIndex.value] = { ...eventForm.value }
    }
    await contentStore.saveContent('events', newEvents)
    dialogVisible.value = false
    ElMessage.success('Event saved successfully')
  } catch (error) {
    console.error('Error saving event:', error)
    ElMessage.error('Failed to save event. Please try again.')
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
</style>
