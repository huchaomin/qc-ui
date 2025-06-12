// https://github.com/vitejs/vite/discussions/9431
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent

  export default component
}
