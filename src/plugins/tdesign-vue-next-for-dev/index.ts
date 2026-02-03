import type { LoadingPluginType, MessagePluginType, NotificationPluginType } from 'tdesign-vue-next'
import type _default from 'tdesign-vue-next'
import type { DialogPluginType } from 'tdesign-vue-next/es/dialog/plugin.d.ts'
import _TDesign, {
  Button as _Button,
  Card as _Card,
  CheckboxGroup as _CheckboxGroup,
  DateRangePicker as _DateRangePicker,
  DialogPlugin as _DialogPlugin,
  EnhancedTable as _EnhancedTable,
  Form as _Form,
  Image as _Image,
  Input as _Input,
  Link as _Link,
  LoadingPlugin as _LoadingPlugin,
  Message as _Message,
  MessagePlugin as _MessagePlugin,
  NotifyPlugin as _NotifyPlugin,
  Pagination as _Pagination,
  Popconfirm as _Popconfirm,
  RadioGroup as _RadioGroup,
  Select as _Select,
  TabPanel as _TabPanel,
  Textarea as _Textarea,
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
const Select = _Select as (typeof import('tdesign-vue-next'))['Select']
const Table = _EnhancedTable as (typeof import('tdesign-vue-next'))['EnhancedTable']
const Button = _Button as (typeof import('tdesign-vue-next'))['Button']
const DateRangePicker = _DateRangePicker as (typeof import('tdesign-vue-next'))['DateRangePicker']
const Pagination = _Pagination as (typeof import('tdesign-vue-next'))['Pagination']
const Link = _Link as (typeof import('tdesign-vue-next'))['Link']
const Textarea = _Textarea as (typeof import('tdesign-vue-next'))['Textarea']
const Popconfirm = _Popconfirm as (typeof import('tdesign-vue-next'))['Popconfirm']

// 这里导出的名称必须和 tDesignReset 组件的名称一致
export {
  Button,
  Card,
  CheckboxGroup,
  DateRangePicker,
  DialogPlugin,
  Form,
  Image,
  Input,
  Link,
  LoadingPlugin,
  Message,
  MessagePlugin,
  NotifyPlugin,
  Pagination,
  Popconfirm,
  RadioGroup,
  Select,
  Table,
  TabPanel,
  TDesign,
  Textarea,
}
