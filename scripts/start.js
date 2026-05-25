const { spawn } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

const port = process.env.PORT || '3001'

// Next.js standalone output puts server.js at the root
const standaloneServer = path.join(__dirname, '..', 'server.js')
const legacyServer = ['npx', 'next', 'start', '--port', port]

if (fs.existsSync(standaloneServer)) {
  // Standalone mode (production Azure deployment)
  process.env.PORT = port
  const child = spawn('node', [standaloneServer], { stdio: 'inherit' })
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 0)
  })
} else {
  // Dev / non-standalone fallback
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const child = spawn(command, ['next', 'start', '--port', port], { stdio: 'inherit' })
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 0)
  })
}
