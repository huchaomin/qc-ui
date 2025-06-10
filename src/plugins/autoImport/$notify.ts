import type { NotificationInstance, NotificationOptions, NotificationPluginType } from 'tdesign-vue-next'

// NotificationThemeList
enum NotificationCreateType {
  error = 'error',
  info = 'info',
  success = 'success',
  warning = 'warning',
}
type CreateNotificationFnType = (
  content: NotificationOptions['content'],
  options?: Omit<NotificationOptions, 'content' | 'theme'>,
) => Promise<NotificationInstance>
type CreateNotificationType = CreateNotificationFnType &
  {
    [value in NotificationCreateType]: CreateNotificationFnType
  } &
  {
    close: NotificationPluginType['close']
    closeAll: NotificationPluginType['closeAll']
  }

async function create(
  type: `${NotificationCreateType}`,
  content: Parameters<CreateNotificationFnType>[0],
  options: Parameters<CreateNotificationFnType>[1],
) {
  const obj = {
    ...(options ?? {}),
  }
  return NotifyPlugin[type]({
    closeBtn: true,
    content,
    duration: 0,
    title: '提示',
    ...obj,
  })
}

const createNotification: CreateNotificationType = async function (...arg) {
  return create('success', ...arg)
} as CreateNotificationType
Object.values(NotificationCreateType).forEach((type) => {
  createNotification[type] = async (...arg) => {
    return create(type, ...arg)
  }
})

createNotification.closeAll = () => {
  return NotifyPlugin.closeAll()
}

createNotification.close = (...arg: Parameters<NotificationPluginType['close']>) => {
  return NotifyPlugin.close(...arg)
}

export default createNotification
