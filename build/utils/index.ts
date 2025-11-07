import path from 'node:path'
import process from 'node:process'

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p)
}

export { resolvePath }
