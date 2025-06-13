import { tDesignResetComponentsName } from './utils/config.ts'

export default (isProduction: boolean) => {
  return {
    from: isProduction ? 'tdesign-vue-next' : '@/plugins/tdesign-vue-next-for-dev',
    imports: [
      'DialogPlugin',
      'LoadingPlugin',
      'MessagePlugin',
      'NotifyPlugin',
      'Message',
      ...tDesignResetComponentsName.map(name => name.slice(1)),
    ],
  }
}
