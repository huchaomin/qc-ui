import path from 'node:path'
import { globSync } from 'tinyglobby'

const tDesignResetComponentsFiles = globSync('src/components/tDesignReset/*.vue')
const tDesignResetComponentsName = tDesignResetComponentsFiles.map((file) => {
  return path.basename(file, '.vue')
})
const autoImportComponentsSubFolderEntryFiles = globSync('src/components/autoImport/*/Index.vue')
const autoImportComponentsSubFolderEntryName = autoImportComponentsSubFolderEntryFiles.map(
  (file) => {
    return path.relative('src/components', path.dirname(file)).split(path.sep)[1]
  },
)

export { autoImportComponentsSubFolderEntryName, tDesignResetComponentsName }
