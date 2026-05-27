import type { AppContext } from 'vue'
import { getCurrentInstance } from 'vue'

let globalAppContext: AppContext

export default () => {
  if (globalAppContext !== undefined) {
    return globalAppContext
  }

  const instance = getCurrentInstance()

  if (instance !== null) {
    globalAppContext = instance.appContext
    return globalAppContext
  }

  return undefined
}
