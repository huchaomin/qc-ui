import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'
import _ from 'lodash'

type FilterPattern = null | ReadonlyArray<RegExp | string> | RegExp | string

function isExclude(name: string, exclude?: FilterPattern): boolean {
  if (exclude === undefined || exclude === null)
    return false
  if (typeof exclude === 'string')
    return name === exclude
  if (exclude instanceof RegExp)
    return !!name.match(exclude)

  if (Array.isArray(exclude)) {
    for (const item of exclude) {
      if (name === item || name.match(item as RegExp))
        return true
    }
  }

  return false
}

function pascalCase(str: string): string {
  return _.upperFirst(_.camelCase(str))
}

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p)
}

const files = fg.globSync('src/components/tDesignReset/*.vue')
const tDesignResetComponentsName = files.map((file) => {
  return path.basename(file, '.vue')
})

export {
  isExclude,
  pascalCase,
  resolvePath,
  tDesignResetComponentsName,
}
