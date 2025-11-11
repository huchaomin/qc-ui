import type { LoadingPluginType, MessagePluginType, NotificationPluginType } from 'tdesign-vue-next'
import type _default from 'tdesign-vue-next'
import type { DialogPluginType } from 'tdesign-vue-next/es/dialog/plugin.d.ts'
import _TDesign, {
  Card as _Card,
  CheckboxGroup as _CheckboxGroup,
  DialogPlugin as _DialogPlugin,
  Form as _Form,
  Image as _Image,
  Input as _Input,
  LoadingPlugin as _LoadingPlugin,
  Message as _Message,
  MessagePlugin as _MessagePlugin,
  NotifyPlugin as _NotifyPlugin,
  RadioGroup as _RadioGroup,
  TabPanel as _TabPanel,
  // @ts-expect-error 开发环境使用
} from 'tdesign-vue-next/dist/tdesign.min.js'

const DialogPlugin = _DialogPlugin as DialogPluginType
const LoadingPlugin = _LoadingPlugin as LoadingPluginType
const MessagePlugin = _MessagePlugin as MessagePluginType
const NotifyPlugin = _NotifyPlugin as NotificationPluginType
const TDesign = _TDesign as typeof _default
const Message = _Message as (typeof import('tdesign-vue-next'))['Message']
const Card = _Card as (typeof import('tdesign-vue-next'))['Card']
const Form = _Form as (typeof import('tdesign-vue-next'))['Form']
const Image = _Image as (typeof import('tdesign-vue-next'))['Image']
const Input = _Input as (typeof import('tdesign-vue-next'))['Input']
const RadioGroup = _RadioGroup as (typeof import('tdesign-vue-next'))['RadioGroup']
const CheckboxGroup = _CheckboxGroup as (typeof import('tdesign-vue-next'))['CheckboxGroup']
const TabPanel = _TabPanel as (typeof import('tdesign-vue-next'))['TabPanel']

export {
  Card,
  CheckboxGroup,
  DialogPlugin,
  Form,
  Image,
  Input,
  LoadingPlugin,
  Message,
  MessagePlugin,
  NotifyPlugin,
  RadioGroup,
  TabPanel,
  TDesign,
}
