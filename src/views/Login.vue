<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>SAF Dashboard</h2>
          <p>Siim Aimla Funk Band - Content Management</p>
        </div>
      </template>
      
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Username" prop="username">
          <el-input
            v-model="form.username"
            placeholder="Enter username"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-hint">
        <el-text type="info" size="small">
          Contact administrator for credentials
        </el-text>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      error.value = ''
      
      const success = authStore.login(form.username, form.password)
      
      if (success) {
        ElMessage.success('Login successful!')
        router.push('/')
      } else {
        error.value = 'Invalid username or password'
        ElMessage.error('Login failed')
      }
      
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-hint {
  text-align: center;
  margin-top: 16px;
}
</style>
