<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    taskId: string
  }>(),
  {},
)
const {
  loading: loadingVideoSearch,
  onSuccess: onSuccessVideoSearch,
  send: sendVideoSearch,
} = useRequest((data: Record<string, any>) => alovaInst.Post('task/taskContent/handSearch', data), {
  immediate: false,
  initialData: [],
})
const {
  loading: loadingAuthorSearch,
  onSuccess: onSuccessAuthorSearch,
  send: sendAuthorSearch,
} = useRequest(
  (data: Record<string, any>) => alovaInst.Post('task/taskContent/authorSearch', data),
  {
    immediate: false,
    initialData: [],
  },
)
const {
  loading: loadingImageSearch,
  onSuccess: onSuccessImageSearch,
  send: sendImageSearch,
} = useRequest(
  (data: Record<string, any>) => alovaInst.Post('task/taskContent/imageSearch', data),
  {
    immediate: false,
    initialData: [],
  },
)

function send(params: Record<string, any>): void {
  if (currentSearchConfig.value?.type === '3') {
    sendAuthorSearch(params)
  } else {
    sendVideoSearch(params)
  }
}

const tableData = ref<Array<Record<string, any>>>([])
const columns: TableCol[] = [
  {
    ...useVideoTitleColumn({
      useLink: false,
    }),
    resize: {
      maxWidth: 410,
    },
  },
  { colKey: 'publishTime', title: '发布时间' },
  useAuthorNameColumn({
    useLink: false,
  }),
  { colKey: 'commentCount', title: '评论量' },
  { colKey: 'favCount', title: '点赞数' },
  { colKey: 'forwardCount', title: '	转发数' },
  { colKey: 'likeCount', title: '	喜欢数' },
]
const selectedRowKeys = ref<string[]>([])

function handleSelectSearchType(): void {
  const formRef = ref<FormInstance | null>(null)

  $confirm({
    body: () =>
      h(resolveComponent('TForm') as Component<FormProps>, {
        data: reactive({
          toolType: '1',
          type: '1',
        }),
        items: [
          {
            __others: (formData: Record<string, any>) => {
              return {
                onChange: () => {
                  formData.keyword = ''
                  formRef.value!.clearValidate(['keyword'])
                },
              }
            },
            _label: '搜索类型',
            component: 'TRadioGroup',
            model: 'type',
            options: [
              {
                label: '文字',
                value: '1',
              },
              {
                label: '图片',
                value: '2',
              },
              {
                label: '作者名称',
                value: '3',
              },
            ],
          },
          {
            __others: (formData: Record<string, any>) => {
              return {
                show: formData.type !== '3',
              }
            },
            _label: '工具类型',
            component: 'TRadioGroup',
            dicCode: 'tool_type',
            model: 'toolType',
          },
          {
            __others: (formData: Record<string, any>) => {
              return {
                // onChange: (value: { label: string; value: string }) => {
                //   formData.keyword = value.label
                //   formData.keywordValue = value.value
                // },
                show: formData.type === '3',
              }
            },
            _label: '作者名称',
            slot: 'author_name',
          },
          {
            __others: (formData: Record<string, any>) => {
              return {
                disabled: formData.type === '3',
              }
            },
            _label: '搜索词',
            model: 'keyword',
          },
          {
            __others: (formData: Record<string, any>) => {
              return {
                show: formData.type === '2',
              }
            },
            _label: '上传图片',
            autoUpload: true,
            component: 'TUpload',
            model: 'imageUrl',
            requestMethod: {
              biz: 'taskVideo/imageSearch',
            },
            theme: 'image',
          },
        ],
        labelAlign: 'right',
        layout: 'vertical',
        ref: formRef,
      }),
    header: '选择搜索类型',
    onConfirmCallback: async () => {
      await alovaInst.Post('system/dict/type', await formRef.value!.validate())
      $msg('字典添加成功')
      pageListRef.value!.query()
    },
    width: 430, // 730
  })
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-center">
      <TButton @click="handleSelectSearchType">选择搜索类型</TButton>
    </div>
    <TTable
      v-model:selected-row-keys="selectedRowKeys"
      :loading="loadingVideoSearch || loadingImageSearch || loadingAuthorSearch"
      :columns="columns"
      :data="tableData"
      show-row-select="multiple"
    ></TTable>
  </div>
</template>
