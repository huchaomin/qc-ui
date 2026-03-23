import type AutoImport from 'unplugin-auto-import/vite'
import { tDesignResetComponentsName } from './utils/config.ts'

type ArrayItem<T> = T extends (infer U)[] ? U : never

export default (
  isProduction: boolean,
): Array<ArrayItem<Parameters<typeof AutoImport>[0]['imports']>> => {
  return [
    {
      from: isProduction ? 'tdesign-vue-next' : '@/plugins/tdesign-vue-next-for-dev',
      imports: [
        'DialogPlugin',
        'LoadingPlugin',
        'MessagePlugin',
        'NotifyPlugin',
        'Message',
        ...tDesignResetComponentsName.map((name) => {
          const sliceName = name.slice(1)
          const realName = sliceName === 'Table' ? 'EnhancedTable' : sliceName

          return [realName, `_${realName}`] as [string, string]
        }),
      ],
    },
    {
      from: '@/components/tDesignReset/TForm.vue',
      imports: [['default', 'TForm']],
    },
  ]
}
