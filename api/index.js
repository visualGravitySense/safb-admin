import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// For Vercel, use /tmp directory for file storage (temporary)
// Note: /tmp is ephemeral and files will be deleted after function execution
// For production, consider using Vercel Blob Storage or external storage (Cloudinary, S3, etc.)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV

// Determine paths based on environment
let DATA_DIR, UPLOADS_DIR
if (isVercel) {
  DATA_DIR = '/tmp/data'
  UPLOADS_DIR = '/tmp/uploads'
} else {
  // For local development, use server directory
  DATA_DIR = join(process.cwd(), 'server', 'data')
  UPLOADS_DIR = join(process.cwd(), 'server', 'uploads')
}

const DATA_FILE = join(DATA_DIR, 'content.json')

// Ensure directories exist
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Configure multer for file uploads
// On Vercel, files are stored in /tmp (ephemeral)
// For production, you should use Vercel Blob Storage or external storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = extname(file.originalname)
    cb(null, 'image-' + uniqueSuffix + ext)
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

// Serve uploaded files statically (only works locally, not on Vercel)
if (!isVercel) {
  app.use('/uploads', express.static(UPLOADS_DIR))
}

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
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }
    
    writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing content:', error)
    return false
  }
}

// Initialize default content file if it doesn't exist
if (!existsSync(DATA_FILE)) {
  writeContent(defaultContent)
  console.log('📝 Created default content file')
}

// Routes
// Note: Vercel already adds /api prefix, so routes should not include it
// But we'll support both /api/... and /... for compatibility

// Get all content
app.get('/content', (req, res) => {
  try {
    const content = readContent()
    res.json({ success: true, data: content })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get specific section
app.get('/content/:section', (req, res) => {
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
app.put('/content/:section', (req, res) => {
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
app.put('/content', (req, res) => {
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

// Upload image endpoint
const uploadAny = upload.any()

app.post('/upload', (req, res, next) => {
  uploadAny(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message })
    }
    next()
  })
}, (req, res) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : null
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }
    
    // On Vercel, files in /tmp are ephemeral
    // For production, you should upload to Vercel Blob Storage or external storage
    // and return a permanent URL
    const fileUrl = isVercel 
      ? `${process.env.VERCEL_URL || 'https://your-api.vercel.app'}/api/uploads/${file.filename}`
      : `/uploads/${file.filename}`
    
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

// Serve uploaded files (for Vercel)
app.get('/uploads/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = join(UPLOADS_DIR, filename)
    
    if (existsSync(filePath)) {
      // For images, set proper content type
      const ext = extname(filename).toLowerCase()
      const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      }
      res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
      res.sendFile(filePath)
    } else {
      res.status(404).json({ success: false, error: 'File not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete uploaded file
app.delete('/upload/:filename', (req, res) => {
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
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running', 
    timestamp: new Date().toISOString(),
    environment: isVercel ? 'vercel' : 'local'
  })
})

// Export for Vercel serverless functions
// Vercel automatically routes /api/* to this function
// The routes in Express should not include /api prefix
export default (req, res) => {
  // Remove /api prefix if present
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/'
  }
  if (req.path && req.path.startsWith('/api')) {
    req.path = req.path.replace('/api', '') || '/'
  }
  return app(req, res)
}

// For local development, start the server
if (!isVercel && import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`)
    console.log(`📁 Data file: ${DATA_FILE}`)
    console.log(`📸 Uploads directory: ${UPLOADS_DIR}`)
    console.log(`✅ Ready to accept requests`)
  })
}
