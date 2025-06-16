import type {
  // DialogPluginType,
  LoadingPluginType,
  MessagePluginType,
  NotificationPluginType,
} from 'tdesign-vue-next'
import type _default from 'tdesign-vue-next'
import _TDesign, {
  Card as _Card,
  Form as _Form,
  Image as _Image,
  Input as _Input,
  // DialogPlugin as _DialogPlugin,
  LoadingPlugin as _LoadingPlugin,
  Message as _Message,
  MessagePlugin as _MessagePlugin,
  NotifyPlugin as _NotifyPlugin,
  // @ts-expect-error 开发环境使用
} from 'tdesign-vue-next/dist/tdesign.min.js'

// const DialogPlugin = _DialogPlugin as DialogPluginType
const LoadingPlugin = _LoadingPlugin as LoadingPluginType
const MessagePlugin = _MessagePlugin as MessagePluginType
const NotifyPlugin = _NotifyPlugin as NotificationPluginType
const TDesign = _TDesign as typeof _default
const Message = _Message as typeof import('tdesign-vue-next')['Message']
const Card = _Card as typeof import('tdesign-vue-next')['Card']
const Form = _Form as typeof import('tdesign-vue-next')['Form']
const Image = _Image as typeof import('tdesign-vue-next')['Image']
const Input = _Input as typeof import('tdesign-vue-next')['Input']

export {
  Card,
  Form,
  Image,
  Input,
  // DialogPlugin,
  LoadingPlugin,
  Message,
  MessagePlugin,
  NotifyPlugin,
  TDesign,
}
