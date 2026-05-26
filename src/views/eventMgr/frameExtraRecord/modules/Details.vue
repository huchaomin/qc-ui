<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    recordId: string
  }>(),
  {},
)
const index = ref(0)
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('yq/frameExtraDetail/list', {
          params: {
            ...o,
            recordId: props.recordId,
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    {
      colKey: 'title',
      resize: {
        maxWidth: 400,
      },
      title: '标题',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_status',
      },
      colKey: 'extraStatus',
      title: '抽帧状态',
    },
    {
      cell: (_, { row }) => {
        const arr: Array<Record<string, any>> = []

        row.videoExtraDetails?.forEach((item1: Record<string, any>) => {
          item1.ocrImageContents?.forEach((item2: Record<string, any>) => {
            arr.push(item2)
          })
        })

        if (arr.length > 0) {
          return {
            _component: 'ImageViewer',
            images: arr.map((item) => item.fileUrl),
            index: index.value,
            onClose: () => {
              index.value = 0
            },
            onIndexChange: (value: number) => {
              index.value = value
            },
            title: (h) => {
              return h(
                'div',
                {
                  class: 'flex flex-col gap-1',
                },
                [
                  h('span', {}, `${index.value + 1}/${arr.length}`),
                  ...(isFalsy(arr[index.value].imageTime)
                    ? []
                    : [h('span', {}, arr[index.value].imageTime)]),
                  h('span', {}, arr[index.value].ocrContent),
                ],
              )
            },
          }
        } else {
          return {
            _component: 'Default',
            default: '',
          }
        }
      },
      colKey: 'videoExtraDetails',
      title: '抽帧详情',
    },
    {
      colKey: 'errorMsg',
      resize: {
        maxWidth: 300,
      },
      title: '错误信息',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'createTime',
      title: '创建日期',
    },
  ],
  formItems: [
    {
      _label: '抽帧状态',
      component: 'TSelect',
      dicCode: 'extra_status',
      model: 'extraStatus',
    },
  ],
  tableOtherProps: {
    flexHeight: false,
    showColumnConfigBtn: false,
    showToggleFullscreenBtn: false,
  },
}
</script>

<template>
  <PageList v-bind="config"> </PageList>
</template>
