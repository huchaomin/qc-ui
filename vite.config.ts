import type * as http from 'node:http'
import type { ProxyOptions } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'
import { createHtmlPlugin } from 'vite-plugin-html'
import autoImportStoreList from './build/autoImportStores.ts'
import tDesignAutoImport from './build/tDesignAutoImport.ts'
import TDesignResolver from './build/tDesignResolver.ts'
import { resolvePath } from './build/utils/index.ts'
import vitePlugins from './build/vitePlugins.ts'

function bypass(req: http.IncomingMessage, res: http.ServerResponse | undefined, options: ProxyOptions): void {
  if (req.url !== undefined && options.rewrite !== undefined && typeof options.target === 'string' && res !== undefined) {
    const reqUrl = req.url
    const proxyUrl = new URL(options.rewrite(reqUrl), options.target).href
    res.setHeader('X-Res-ProxyUrl', proxyUrl) // 查看真实的请求地址
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = resolvePath('build/env')
  const env = parseLoadedEnv(loadEnv(mode, envDir)) as ImportMetaEnv
  const {
    VITE_API_PREFIX,
    VITE_APP_NAME,
    VITE_BASE_URL,
    VITE_SERVER_PORT,
    VITE_SERVER_URL,
  } = env
  console.log({
    command,
    env,
    mode,
  })
  const isProduction = mode === 'production'
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
    envDir, // 将 env 文件里面的变量注入到 import.meta.env 里面
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
      ],
    },
    plugins: [
      envParse({
        dtsPath: resolvePath('types/env.d.ts'),
      }),
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
      tailwindcss(),
      vue(),
      vueJsx(),
      AutoImport({ // 用于自动导入 函数/工具库 的 API
        defaultExportByFilename: true,
        dirs: [resolvePath('src/plugins/autoImport'), resolvePath('src/hooks'), resolvePath('src/utils')],
        dts: resolvePath('types/auto-imports.d.ts'),
        imports: [
          'vue',
          'vue-router',
          'pinia',
          tDesignAutoImport(isProduction),
          {
            '@/plugins/alova/generate/pl-admin/index.ts': [['default', 'PlAdmin']],
          },
          autoImportStoreList,
        ],
        resolvers: [
          ...(isProduction
            ? [TDesignResolver({
                library: 'vue-next',
              })]
            : []),
        ],
        vueTemplate: true,
      }),
      Components({ // 用于自动导入 Vue 组件
        dirs: [
          resolvePath('src/components/autoImport'),
        ],
        dts: resolvePath('types/components.d.ts'),
        resolvers: [
          ...(isProduction
            ? [TDesignResolver({
                library: 'vue-next',
              })]
            : []),
          IconsResolver({
            customCollections: ['custom'],
            // enabledCollections: ['mdi', 'line-md', 'material-symbols'],
          }),
        ],
      }),
      Icons({
        customCollections: {
          custom: FileSystemIconLoader(resolvePath('src/assets/svgIcons')),
        },
        iconCustomizer: (collection, icon, props) => {
          props.width = props.width ?? '24'
          props.height = props.width ?? '24'
        },
      }),
      ...vitePlugins[isProduction ? 'production' : 'development'],
    ],
    resolve: {
      alias: {
        '@': resolvePath('src'),
        'img': resolvePath('src/assets/images'),
      },
      // https://cn.vitejs.dev/guide/performance.html#reduce-resolve-operations
      // 不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
      extensions: ['.ts'],
    },
    server: {
      // vite preview 也会走该代理
      host: '0.0.0.0', // 可以用ip访问
      open: false,
      port: VITE_SERVER_PORT + 1000,
      proxy: {
        [path.posix.join(VITE_BASE_URL, VITE_API_PREFIX)]: {
          bypass,
          changeOrigin: true,
          rewrite: (p) => {
            return VITE_BASE_URL === '/' ? p : p.replace(new RegExp(VITE_BASE_URL), '')
          },
          target: VITE_SERVER_URL,
        },
      },
    },
  }
})
