import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isWindows = process.platform === 'win32'

console.log('🚀 Starting API and Dashboard...\n')
console.log('📝 Press Ctrl+C to stop both servers\n')

let api, vite

// Start API server
try {
  const apiScript = join(__dirname, 'server', 'index.js')
  if (!existsSync(apiScript)) {
    console.error('❌ API script not found:', apiScript)
    process.exit(1)
  }

  api = spawn('node', [apiScript], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWindows
  })

  api.on('error', (err) => {
    console.error('❌ Failed to start API:', err.message)
    process.exit(1)
  })
} catch (err) {
  console.error('❌ Error starting API:', err.message)
  process.exit(1)
}

// Wait a bit before starting Vite
setTimeout(() => {
  try {
    vite = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    })

    vite.on('error', (err) => {
      console.error('❌ Failed to start Vite:', err.message)
      if (api) api.kill()
      process.exit(1)
    })
  } catch (err) {
    console.error('❌ Error starting Vite:', err.message)
    if (api) api.kill()
    process.exit(1)
  }
}, 1000)

// Handle process exit
const cleanup = () => {
  console.log('\n\n🛑 Shutting down servers...')
  if (api) {
    api.kill('SIGTERM')
  }
  if (vite) {
    vite.kill('SIGTERM')
  }
  setTimeout(() => {
    process.exit(0)
  }, 1000)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err)
  cleanup()
})
