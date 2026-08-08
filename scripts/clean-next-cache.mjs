import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

const nextDir = resolve(process.cwd(), '.next')

if (!nextDir.startsWith(process.cwd())) {
    throw new Error(`Refusing to remove unexpected path: ${nextDir}`)
}

rmSync(nextDir, { recursive: true, force: true })
console.log(`Removed ${nextDir}`)
