import type { TDesignResolverOptions } from '@tdesign-vue-next/auto-import-resolver'
import type * as http from 'node:http'
import type { Plugin, ProxyOptions } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { parseLoadedEnv } from 'vite-plugin-env-parse'
import { createHtmlPlugin } from 'vite-plugin-html'
import tailwindAutoReference from 'vite-plugin-vue-tailwind-auto-reference'
import autoImportStoreList from './build/autoImportStores.ts'
import tDesignAutoImport from './build/tDesignAutoImport.ts'
import {
  autoImportComponentsSubFolderEntryName,
  tDesignResetComponentsName,
} from './build/utils/config.ts'
import { needPort, resolvePath } from './build/utils/index.ts'
import vitePlugins from './build/vitePlugins.ts'

function bypass(
  req: http.IncomingMessage,
  res: http.ServerResponse | undefined,
  options: ProxyOptions,
): void {
  if (
    req.url !== undefined &&
    options.rewrite !== undefined &&
    typeof options.target === 'string' &&
    res !== undefined
  ) {
    const reqUrl = req.url
    const proxyUrl = new URL(options.rewrite(reqUrl), options.target).href

    res.setHeader('X-Res-ProxyUrl', proxyUrl) // 查看真实的请求地址
  }
}

const TDesignResolverConfig: TDesignResolverOptions = {
  exclude: [
    ...tDesignResetComponentsName,
    'TIcon',
    'TPrimaryTable',
    'TEnhancedTable',
    'TBaseTable',
  ],
  library: 'vue-next',
  resolveIcons: false, // 禁用 https://tdesign.tencent.com/icons  TDesign 图标独立站点 的图标
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = resolvePath('build/env')
  const env = parseLoadedEnv(loadEnv(mode, envDir)) as {
    VITE_API_PROXY_PORT_ARRAY: Array<[string, number]>
    VITE_APP_NAME?: string
    VITE_BASE_URL?: string
    VITE_FORCE_PWD_CHANGE?: boolean
    VITE_PROXY_TARGET: string | string[]
    VITE_USE_LOGIN_CAPTCHA?: boolean
  }
  const {
    VITE_API_PROXY_PORT_ARRAY,
    VITE_APP_NAME = '',
    VITE_BASE_URL = '/',
    VITE_FORCE_PWD_CHANGE = true,
    VITE_PROXY_TARGET: viteProxyTarget,
    VITE_USE_LOGIN_CAPTCHA = true,
  } = env
  const VITE_PROXY_TARGET = Array.isArray(viteProxyTarget) ? viteProxyTarget : [viteProxyTarget]

  console.log({
    command,
    mode,
    VITE_API_PROXY_PORT_ARRAY,
    VITE_APP_NAME,
    VITE_BASE_URL,
    VITE_FORCE_PWD_CHANGE,
    VITE_PROXY_TARGET,
    VITE_USE_LOGIN_CAPTCHA,
  })

  const isProduction = mode === 'production'
  const getProxyTarget = (index: number, port: number) => {
    const target = VITE_PROXY_TARGET.length > 1 ? VITE_PROXY_TARGET[index] : VITE_PROXY_TARGET[0]

    return needPort(target) ? `${target}:${port}` : target
  }

  return {
    build: {
      cssMinify: 'lightningcss',
    },
    clearScreen: false, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    css: {
      lightningcss: {
        // https://cn.vitejs.dev/config/shared-options#css-lightningcss
        targets: browserslistToTargets(browserslist('>= 0.25%')),
      },
      transformer: 'lightningcss',
    },
    define: {
      VITE_API_PREFIX_ARRAY: JSON.stringify(VITE_API_PROXY_PORT_ARRAY.map(([prefix]) => prefix)),
      VITE_APP_NAME: JSON.stringify(VITE_APP_NAME),
      VITE_BASE_URL: JSON.stringify(VITE_BASE_URL),
      VITE_FORCE_PWD_CHANGE: JSON.stringify(VITE_FORCE_PWD_CHANGE),
      VITE_USE_LOGIN_CAPTCHA: JSON.stringify(VITE_USE_LOGIN_CAPTCHA),
    },
    // envDir, // 将 env 文件里面的变量注入到 import.meta.env 里面
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      include: [
        'tdesign-vue-next/dist/tdesign.min.js',
        'nprogress',
        'path-browserify',
        'file-saver',
        'lodash-es',
        'crypto-js',
        'pinia-plugin-persistedstate',
        'alova',
        'alova/fetch',
        'alova/vue',
        '@vueuse/integrations/useNProgress',
        '@vueuse/integrations/useCookies',
        '@iconify/vue',
        '@formkit/auto-animate',
        '@formkit/auto-animate/vue',
        'dayjs',
      ],
    },
    plugins: [
      // envParse({
      //   dtsPath: resolvePath('types/env.d.ts'),
      // }),
      createHtmlPlugin({
        entry: `../src/main.${isProduction ? 'prod' : 'dev'}.ts`,
        inject: {
          data: {
            title: VITE_APP_NAME,
          },
        },
        minify: true,
        template: 'build/index.html',
      }),
      tailwindAutoReference(resolvePath('src/assets/css/tailwindcss-entry.css')) as Plugin,
      tailwindcss(),
      vue(),
      vueJsx(),
      AutoImport({
        // 用于自动导入 函数/工具库 的 API
        defaultExportByFilename: true,
        dirs: [
          resolvePath('src/plugins/autoImport'),
          resolvePath('src/hooks'),
          resolvePath('src/utils/autoImport.ts'),
        ],
        dirsScanOptions: {
          types: false, // Enable auto import the types under the directories
        },
        dts: resolvePath('types/auto-imports.d.ts'),
        dtsMode: 'overwrite', // overwrite the whole existing .d.ts file with the new type definitions.
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          tDesignAutoImport(isProduction), // const xxx = _${compo} 自动导入
          {
            from: 'alova/client',
            imports: ['useRequest', 'useWatcher', 'usePagination'],
          },
          {
            from: '@/plugins/others/directive.ts',
            imports: ['checkPermissions'],
          },
          {
            '@/plugins/alova/generate/pl-admin/index.ts': [['default', 'PlAdmin']],
          },
          {
            '@/plugins/alova/index.ts': [['default', 'alovaInst']],
          },
          {
            from: '@/components/tDesignReset/TForm.vue',
            imports: ['FormItem', 'FormInstance', 'FormProps'],
            type: true,
          },
          {
            from: '@/components/tDesignReset/TTable.vue',
            imports: ['TableRowData', 'TableCol'],
            type: true,
          },
          {
            from: '@/components/tDesignReset/TUpload.vue',
            imports: ['UploadFile', 'UploadInstanceFunctions'],
            type: true,
          },
          {
            from: '@/components/autoImport/PageList/Index.vue',
            imports: ['PageListProps'],
            type: true,
          },
          {
            from: '@/store/modules/router.ts',
            imports: ['RouteRecordRaw'],
            type: true,
          },
          autoImportStoreList,
        ],
        resolvers: [...(isProduction ? [TDesignResolver(TDesignResolverConfig)] : [])],
        vueTemplate: true,
      }),
      Components({
        deep: false,
        // 用于自动导入 Vue 组件
        dirs: [resolvePath('src/components/autoImport')],
        dts: resolvePath('types/components.d.ts'),
        resolvers: [
          ...(isProduction ? [TDesignResolver(TDesignResolverConfig)] : []),
          (componentName) => {
            if (autoImportComponentsSubFolderEntryName.includes(componentName)) {
              return {
                from: `@/components/autoImport/${componentName}/Index.vue`,
                name: 'default',
              }
            }
          },
        ],
        syncMode: 'overwrite',
      }),
      ...vitePlugins[isProduction ? 'production' : 'development'],
    ],
    resolve: {
      alias: {
        '@': resolvePath('src'),
        img: resolvePath('src/assets/images'),
      },
      // https://cn.vitejs.dev/guide/performance.html#reduce-resolve-operations
      // 不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
      extensions: ['.ts'],
    },
    server: {
      // vite preview 也会走该代理
      host: '0.0.0.0', // 可以用ip访问
      open: false,
      port: VITE_API_PROXY_PORT_ARRAY[0][1] + 1000,
      proxy: Object.fromEntries(
        VITE_API_PROXY_PORT_ARRAY.map(([prefix, port], index) => [
          path.posix.join(VITE_BASE_URL, prefix),
          {
            bypass,
            changeOrigin: true,
            rewrite: (p) => {
              return VITE_BASE_URL === '/' ? p : p.replace(new RegExp(VITE_BASE_URL), '')
            },
            target: getProxyTarget(index, port),
          },
        ]),
      ),
      strictPort: true,
    },
  }
})
