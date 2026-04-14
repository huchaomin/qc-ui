import type { TableCol } from '@/components/tDesignReset/TTable.vue'
import LiveInfo from '../components/LiveInfo.vue'

export function useAuthorNameColumn({ colKey = 'authorName', useLink = true } = {}): TableCol {
  const router = useRouter()

  return {
    cell: (_, { row }) => {
      if (useLink && router.hasRoute('BrandAuthorDetail')) {
        return {
          _component: 'Link',
          disabled: isFalsy(_get(row, 'authorCode')),
          onClick: () => {
            void router.push({
              name: 'BrandAuthorDetail',
              query: {
                authorCode: (row as Record<string, any>).authorCode as string,
              },
            })
          },
        }
      }

      return {
        _component: 'Default',
      }
    },
    colKey,
    title: '作者名称',
  }
}
export function useEventNameColumn({ colKey = 'eventName', useLink = true } = {}): TableCol {
  const router = useRouter()

  return {
    cell: (_, { row }) => {
      if (useLink && router.hasRoute('EventDetail')) {
        return {
          _component: 'Link',
          onClick: () => {
            const url = router.resolve({
              name: 'EventDetail',
              query: {
                id: (row as Record<string, any>).id as string,
              },
            })

            window.open(url.href, '_blank')
          },
        }
      }

      return {
        _component: 'Default',
      }
    },
    colKey,
    title: '事件名称',
  }
}
export function useTaskNameNameColumn({ colKey = 'name', useLink = true } = {}): TableCol {
  const router = useRouter()

  return {
    cell: (_, { row: _row }) => {
      const row = _row as Record<string, any>

      if (useLink) {
        // 直播监控任务
        if (row.taskType === 3) {
          return {
            _component: 'Link',
            onClick: () => {
              $dialog({
                body: () =>
                  h(LiveInfo, {
                    taskId: row.id ?? row.taskId,
                  }),
                footer: false,
                header: `【${row[colKey]}】直播信息`,
                width: 1500,
              })
            },
          }
        }

        if (router.hasRoute('TaskDetail')) {
          return {
            _component: 'Link',
            onClick: () => {
              void router.push({
                name: 'TaskDetail',
                query: {
                  id: row.id as string,
                },
              })
            },
          }
        }
      }

      return {
        _component: 'Default',
      }
    },
    colKey,
    title: '任务名称',
  }
}
export function useVideoTitleColumn(option?: {
  bciIdKey?: string
  colKey?: string
  funType?: number
  useLink?: boolean
}): TableCol {
  const { bciIdKey = 'bciId', colKey = 'title', funType, useLink = true } = option ?? {}
  const router = useRouter()

  return {
    cell: (_, { row: _row }) => {
      const row = _row as Record<string, any>
      const contentType = _get(row, 'contentType') as number

      if (useLink && !isFalsy(contentType)) {
        let routeName = ''

        if (contentType === 1 && router.hasRoute('VideoDetail')) {
          routeName = 'VideoDetail'
        } else if (contentType === 2 && router.hasRoute('TextImagesDetail')) {
          routeName = 'TextImagesDetail'
        }

        if (routeName !== '') {
          return {
            _component: 'Link',
            default: isFalsy(_get(row, colKey)) ? '无标题' : (_get(row, colKey) as string),
            onClick: () => {
              if (row.read === false) {
                if (isFalsy(funType)) {
                  return
                }

                // 更改已读状态
                void alovaInst
                  .Post('yq/contentReadRecord', {
                    dataId: _get(row, 'id') as string,
                    funType,
                  })
                  .then(() => {
                    row.read = true
                  })
              }

              const url = router.resolve({
                name: routeName,
                query: {
                  id: _get(row, bciIdKey) as string,
                },
              })

              window.open(url.href, '_blank')
            },
            theme: row.read === true ? 'success' : 'primary',
          }
        }
      }

      return {
        _component: 'Default',
        default: isFalsy(_get(row, colKey)) ? '无标题' : (_get(row, colKey) as string),
      }
    },
    colKey,
    resize: {
      maxWidth: 300,
    },
    title: '标题',
  }
}
