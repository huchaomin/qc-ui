import path from 'node:path'
import fg from 'fast-glob'

const tDesignResetComponentsFiles = fg.globSync('src/components/tDesignReset/*.vue')
const tDesignResetComponentsName = tDesignResetComponentsFiles.map((file) => {
  return path.basename(file, '.vue')
})
const autoImportComponentsSubFolderEntryFiles = fg.globSync('src/components/autoImport/*/Index.vue')
const autoImportComponentsSubFolderEntryName = autoImportComponentsSubFolderEntryFiles.map(
  (file) => {
    return path.relative('src/components', path.dirname(file)).split(path.sep)[1]
  },
)

console.log(autoImportComponentsSubFolderEntryName)

export { autoImportComponentsSubFolderEntryName, tDesignResetComponentsName }
