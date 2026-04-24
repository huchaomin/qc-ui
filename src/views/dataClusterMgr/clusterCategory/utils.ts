const { data: clusterCategoryList, send: clusterCategoryListSend } = useRequest(
  alovaInst.Get<Record<string, any>[]>('yq/clusterCategory/getList', {
    transform: (res) => {
      return (res as Record<string, any>[]).map((item) => ({
        label: item.categoryName as string,
        value: item.id as string,
      }))
    },
  }),
  {
    immediate: false,
    initialData: [],
  },
)

export { clusterCategoryList, clusterCategoryListSend }
