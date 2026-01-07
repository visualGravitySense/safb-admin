import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = join(__dirname, 'data', 'content.json')
const UPLOADS_DIR = join(__dirname, 'uploads')

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(file.originalname.toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
    }
  }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR))

// Initialize default content
const defaultContent = {
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
    enabled: true,
    responseTime: '24h',
    defaultMessage: 'Täida lihtne vorm ja saame sinuga ühendust 24 tunni jooksul!'
  }
}

// Helper functions
const readContent = () => {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
    return defaultContent
  } catch (error) {
    console.error('Error reading content:', error)
    return defaultContent
  }
}

const writeContent = (content) => {
  try {
    // Ensure data directory exists
    const dataDir = join(__dirname, 'data')
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
    
    writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing content:', error)
    return false
  }
}

// Initialize default content file if it doesn't exist
const dataDir = join(__dirname, 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}
if (!existsSync(DATA_FILE)) {
  writeContent(defaultContent)
  console.log('📝 Created default content file')
}

// Routes

// Get all content
app.get('/api/content', (req, res) => {
  try {
    const content = readContent()
    res.json({ success: true, data: content })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get specific section
app.get('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params
    const content = readContent()
    
    if (!content[section]) {
      return res.status(404).json({ success: false, error: 'Section not found' })
    }
    
    res.json({ success: true, data: content[section] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update specific section
app.put('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params
    const newData = req.body
    
    const content = readContent()
    content[section] = { ...content[section], ...newData }
    
    if (writeContent(content)) {
      res.json({ success: true, data: content[section] })
    } else {
      res.status(500).json({ success: false, error: 'Failed to save content' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update entire content
app.put('/api/content', (req, res) => {
  try {
    const newContent = req.body
    
    if (writeContent(newContent)) {
      res.json({ success: true, data: newContent })
    } else {
      res.status(500).json({ success: false, error: 'Failed to save content' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Upload image endpoint - accepts both 'image' and 'file' field names
const uploadAny = upload.any()

app.post('/api/upload', (req, res, next) => {
  uploadAny(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message })
    }
    next()
  })
}, (req, res) => {
  try {
    // Get file from req.files array (multer.any() puts files in req.files)
    const file = req.files && req.files.length > 0 ? req.files[0] : null
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }
    
    const fileUrl = `/uploads/${file.filename}`
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete uploaded file
app.delete('/api/upload/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = join(UPLOADS_DIR, filename)
    
    if (existsSync(filePath)) {
      unlinkSync(filePath)
      res.json({ success: true, message: 'File deleted successfully' })
    } else {
      res.status(404).json({ success: false, error: 'File not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`)
  console.log(`📁 Data file: ${DATA_FILE}`)
  console.log(`📸 Uploads directory: ${UPLOADS_DIR}`)
  console.log(`✅ Ready to accept requests`)
  console.log(`\nEndpoints:`)
  console.log(`  GET    http://localhost:${PORT}/api/content`)
  console.log(`  GET    http://localhost:${PORT}/api/content/:section`)
  console.log(`  PUT    http://localhost:${PORT}/api/content/:section`)
  console.log(`  POST   http://localhost:${PORT}/api/upload`)
  console.log(`  DELETE http://localhost:${PORT}/api/upload/:filename`)
  console.log(`  GET    http://localhost:${PORT}/api/health\n`)
})
