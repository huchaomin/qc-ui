import path from 'node:path'
import { globSync } from 'tinyglobby'
import { upperFirst } from './utils/index.ts'

const piniaStoreKeys: string[] = []
// function fileRecursion(filePath :string) :void {
//   const files = readdirSync(filePath);
//   files.forEach((fileName) => {
//     const fileP = path.join(filePath, fileName);
//     const stats = statSync(fileP);
//     const isFile = stats.isFile();
//     const isDir = stats.isDirectory();
//     if (isFile) {
//       piniaStoreKeys.push(path.basename(fileP, '.ts'));
//     }
//     if (isDir) {
//       fileRecursion(fileP);
//     }
//   });
// }
// fileRecursion(resolvePath(__dirname, '../src/store/modules'));
const files = globSync('src/store/modules/*.ts') // 当前工作目录为根目录

files.forEach((p) => {
  piniaStoreKeys.push(path.basename(p, '.ts'))
})

const customerImport: Record<string, [string, string][]> = {}

piniaStoreKeys.forEach((key) => {
  customerImport[`@/store/modules/${key}`] = [['default', `use${upperFirst(key)}Store`]]
})

export default customerImport
