const { data: clusterTypeList, send: clusterTypeListSend } = useRequest(
  alovaInst.Get<Record<string, any>[]>('yq/clusterType/getList', {
    transform: (res) => {
      return (res as Record<string, any>[]).map((item) => ({
        label: item.typeName as string,
        value: item.id as string,
      }))
    },
  }),
  {
    immediate: false,
    initialData: [],
  },
)

export { clusterTypeList, clusterTypeListSend }
