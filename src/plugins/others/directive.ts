import type { App, Directive } from 'vue'

export type VPermissionDirective = Directive<HTMLElement, Parameters<typeof checkPermissions>[0]>

export function checkPermissions(v?: string | string[]): boolean {
  if (v === undefined) {
    return true
  }

  const value = Array.isArray(v) ? v : [v]

  return useUserStore().permissions.some((permission) => {
    return permission === '*:*:*' || value.includes(permission)
  })
}

export default {
  install(app: App): void {
    app.directive('permission', {
      mounted(el, binding) {
        if (!checkPermissions(binding.value)) {
          el.remove()
        }
      },
    } satisfies VPermissionDirective)
  },
}
