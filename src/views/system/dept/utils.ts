import { flatArrToTree } from '@/utils'

const { data: deptTreeList, send: deptTreeListSend } = useRequest(
  alovaInst.Get<Record<string, any>[]>('system/dept/list', {
    transform: (res) => {
      return flatArrToTree(
        (res as Record<string, any>[]).map((item) => {
          return {
            ...item,
            label: item.deptName as string,
            value: item.deptId as string,
          }
        }),
        {
          idKey: 'value',
        },
      )
    },
  }),
  {
    initialData: [],
  },
)

export { deptTreeList, deptTreeListSend }
