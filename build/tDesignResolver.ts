import type { TDesignResolver } from 'unplugin-vue-components/resolvers'
import { tDesignResetComponentsName } from './utils/config.ts'
import { isExclude } from './utils/index.ts'

export default (
  options: Parameters<typeof TDesignResolver>[0] = {},
): ReturnType<typeof TDesignResolver> => {
  const pluginList = [
    'DialogPlugin',
    'LoadingPlugin',
    'MessagePlugin',
    'NotifyPlugin',
  ]

  return {
    resolve: (name) => {
      const { exclude, library = 'vue' } = options
      const importFrom = options.esm ? '/esm' : ''

      if (isExclude(name, exclude)) {
        return
      }

      if (options.resolveIcons && name.match(/[a-z]Icon$/) !== null) {
        return
        // 不使用 tdesign-icons-vue-next
        // return {
        //   from: `tdesign-icons-${library}${importFrom}`,
        //   name,
        // }
      }

      if (tDesignResetComponentsName.includes(name)) {
        return {
          from: `@/components/tDesignReset/${name}.vue`,
          name: 'default',
        }
      }

      if (name.startsWith('TTypography') || name.startsWith('Typography')) {
        return {
          from: `tdesign-${library}${importFrom}`,
          name: name.slice(name.startsWith('TTypography') ? 11 : 10),
        }
      }

      if (name.match(/^T[A-Z]/) !== null || pluginList.includes(name)) {
        // 不使用内置的 icon
        if (name === 'TIcon') {
          return
        }

        const importName = name.match(/^T[A-Z]/) !== null ? name.slice(1) : name

        return {
          from: `tdesign-${library}${importFrom}`,
          name: importName,
        }
      }
    },
    type: 'component',
  }
}
