import path from 'node:path'
import process from 'node:process'

function needPort(target: string): boolean {
  return target.startsWith('http://192.')
}

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p)
}

// https://you-dont-need.github.io/You-Dont-Need-Lodash-Underscore/#/?id=_upperfirst
function upperFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export { needPort, resolvePath, upperFirst }
