const { spawn } = require('node:child_process')

const port = process.env.PORT || '3001'
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const child = spawn(command, ['next', 'start', '--port', port], {
  stdio: 'inherit',
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})
