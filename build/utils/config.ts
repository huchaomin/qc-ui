import path from 'node:path'
import fg from 'fast-glob'

const files = fg.globSync('src/components/tDesignReset/*.vue')
const tDesignResetComponentsName = files.map((file) => {
  return path.basename(file, '.vue')
})

export { tDesignResetComponentsName }
