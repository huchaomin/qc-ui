import path from 'node:path'
import process from 'node:process'
import _ from 'lodash'

function pascalCase(str: string): string {
  return _.upperFirst(_.camelCase(str))
}

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p)
}

export {
  pascalCase,
  resolvePath,
}
