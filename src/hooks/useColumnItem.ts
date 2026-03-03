import type { TableCol } from '@/components/tDesignReset/TTable.vue'

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
export function useTaskNameNameColumn({ colKey = 'name', useLink = true } = {}): TableCol {
  const router = useRouter()

  return {
    cell: (_, { row }) => {
      if (useLink && router.hasRoute('TaskDetail')) {
        return {
          _component: 'Link',
          onClick: () => {
            void router.push({
              name: 'TaskDetail',
              query: {
                id: (row as Record<string, any>).id as string,
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
    title: '任务名称',
  }
}
export function useVideoTitleColumn({
  bciIdKey = 'bciId',
  colKey = 'title',
  useLink = true,
} = {}): TableCol {
  const router = useRouter()

  return {
    cell: (_, { row }) => {
      if (useLink && router.hasRoute('VideoDetail')) {
        return {
          _component: 'Link',
          default: isFalsy(_get(row, colKey)) ? '无标题' : (_get(row, colKey) as string),
          onClick: () => {
            const url = router.resolve({
              name: 'VideoDetail',
              query: {
                id: _get(row, bciIdKey) as string,
              },
            })

            window.open(url.href, '_blank')
          },
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
