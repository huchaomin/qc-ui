import type {
  // DialogPluginType,
  LoadingPluginType,
  MessagePluginType,
  NotificationPluginType,
} from 'tdesign-vue-next'
import type _default from 'tdesign-vue-next'
import _TDesign, {
  // DialogPlugin as _DialogPlugin,
  LoadingPlugin as _LoadingPlugin,
  MessagePlugin as _MessagePlugin,
  NotifyPlugin as _NotifyPlugin,
  // @ts-expect-error 开发环境使用
} from 'tdesign-vue-next/dist/tdesign.min.js'

// const DialogPlugin = _DialogPlugin as DialogPluginType
const LoadingPlugin = _LoadingPlugin as LoadingPluginType
const MessagePlugin = _MessagePlugin as MessagePluginType
const NotifyPlugin = _NotifyPlugin as NotificationPluginType
const TDesign = _TDesign as typeof _default

export {
  // DialogPlugin,
  LoadingPlugin,
  MessagePlugin,
  NotifyPlugin,
  TDesign,
}
