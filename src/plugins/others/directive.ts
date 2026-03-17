import type { App, Directive } from 'vue'

export type VCopyDirective = Directive<HTMLElement, string>
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
    app.directive('copy', {
      mounted(_el, { value }) {
        const el = _el as HTMLElement & {
          __copyHandler?: (e: Event) => void
          __copyText?: string
        }

        el.__copyText = value ?? el.textContent

        el.__copyHandler = (e: Event) => {
          e.stopPropagation()

          if (isFalsy(el.__copyText)) {
            void $msg.error('复制失败')
            return
          }

          const { copy } = useClipboard({
            legacy: true,
          })

          void copy(el.__copyText!)
            .then(() => {
              void $msg('复制成功')
            })
            .catch(() => {
              void $msg.error('复制失败')
            })
        }

        el.addEventListener('click', el.__copyHandler)
      },
      unmounted(_el) {
        const el = _el as HTMLElement & {
          __copyHandler: (e: Event) => void
        }

        el.removeEventListener('click', el.__copyHandler)
      },
      updated(_el, { value }) {
        const el = _el as HTMLElement & {
          __copyText?: string
        }

        el.__copyText = value ?? el.textContent
      },
    } satisfies VCopyDirective)
  },
}
