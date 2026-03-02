import type { TableCol } from '@/components/tDesignReset/TTable.vue'

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
