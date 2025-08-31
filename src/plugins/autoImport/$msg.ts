import type {
  MessageInstance,
  MessageOptions,
  MessagePluginType,
} from 'tdesign-vue-next'

// MessageThemeList
enum MessageCreateType {
  error = 'error',
  info = 'info',
  loading = 'loading',
  question = 'question',
  success = 'success',
  warning = 'warning',
}

export type CreateMessageFnType = (
  content: MessageOptions['content'],
  options?: Omit<MessageOptions, 'content' | 'theme'>,
) => Promise<MessageInstance>
type CreateMessageType = CreateMessageFnType & {
  [value in MessageCreateType]: CreateMessageFnType
} & {
  close: MessagePluginType['close']
  closeAll: MessagePluginType['closeAll']
}

async function create(
  type: `${MessageCreateType}`,
  content: Parameters<CreateMessageFnType>[0],
  options: Parameters<CreateMessageFnType>[1],
) {
  const obj = {
    ...(options ?? {}),
  }
  return MessagePlugin[type]({
    content,
    duration: type === 'loading' ? 0 : 3600,
    ...obj,
  })
}

const createMessage: CreateMessageType = async function (...arg) {
  return create('success', ...arg)
} as CreateMessageType
Object.values(MessageCreateType).forEach((type) => {
  createMessage[type] = async (...arg) => {
    return create(type, ...arg)
  }
})

createMessage.closeAll = () => {
  return MessagePlugin.closeAll()
}

createMessage.close = (...arg: Parameters<MessagePluginType['close']>) => {
  return MessagePlugin.close(...arg)
}

export default createMessage
