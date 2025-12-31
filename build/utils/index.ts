import path from 'node:path'
import process from 'node:process'

function needPort(target: string): boolean {
  return target.startsWith('http://192.')
}

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p)
}

export { needPort, resolvePath }
