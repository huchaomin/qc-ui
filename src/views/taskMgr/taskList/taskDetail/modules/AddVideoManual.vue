<script setup lang="ts">
import AuthorName from '@/bus/components/AuthorName.vue'

const props = withDefaults(
  defineProps<{
    taskId: string
  }>(),
  {},
)
const { onSuccess: onSuccessVideoSearch, send: sendVideoSearch } = useRequest(
  (data: Record<string, any>) =>
    alovaInst.Post<Record<string, any>>('task/taskContent/handSearch', data, {
      meta: {
        useLoading: '搜索中...',
      },
    }),
  {
    immediate: false,
    initialData: [],
  },
)
const { onSuccess: onSuccessAuthorSearch, send: sendAuthorSearch } = useRequest(
  (data: Record<string, any>) =>
    alovaInst.Post<Record<string, any>>('task/taskContent/authorSearch', data, {
      meta: {
        useLoading: '搜索中...',
      },
    }),
  {
    immediate: false,
    initialData: [],
  },
)
const { onSuccess: onSuccessImageSearch, send: sendImageSearch } = useRequest(
  (data: Record<string, any>) =>
    alovaInst.Post<Record<string, any>>('task/taskContent/imageSearch', data, {
      meta: {
        useLoading: '搜索中...',
      },
    }),
  {
    immediate: false,
    initialData: [],
  },
)
const currentSearchConfig = ref<null | Record<string, any>>(null)

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
      h(
        resolveComponent('TForm') as Component<FormProps>,
        {
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
                  show: formData.type === '3',
                }
              },
              _label: '作者名称',
              model: 'keywordValue',
              slot: 'author_name',
            },
            {
              __others: (formData: Record<string, any>) => {
                return {
                  _rules: [
                    {
                      message: '请输入搜索词',
                      required: ['1', '3'].includes(formData.type),
                      trigger: 'blur' as const,
                    },
                  ],
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
              _required: true,
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
        },
        {
          author_name: () =>
            h(AuthorName, {
              onChange: (value: null | { label: string; value: string }) => {
                formRef.value!.setFormData({
                  keyword: value?.label ?? '',
                  keywordValue: value?.value ?? '',
                })
              },
            }),
        },
      ),
    header: '选择搜索类型',
    onConfirmCallback: async () => {
      const formData = await formRef.value!.validate()
      const obj: Record<string, any> = {
        keyword: formData.type === '3' ? formData.keywordValue : formData.keyword,
        toolType: formData.type === '3' ? '1' : formData.toolType,
        type: formData.type,
      }

      if (formData.type === '2') {
        obj.imageUrl = formData.imageUrl[0].url
      }

      if (formData.type === '3') {
        obj.authorLabel = formData.keyword
      }

      if (obj.type === '2') {
        await sendImageSearch({
          imageUrl: obj.imageUrl,
          keyword: obj.keyword,
          taskId: props.taskId,
          toolType: obj.toolType,
        })
      } else {
        await send({
          keyword: obj.keyword,
          taskId: props.taskId,
          toolType: obj.toolType,
        })
      }

      currentSearchConfig.value = obj
    },
    width: 430, // 730
  })
}

const refreshArg = ref<null | Record<string, any>>(null)

function successCallback(
  data: Record<string, any>,
  args: [data: Record<string, any>, ...args: any[]],
): void {
  tableData.value = data.handSearchDTOs ?? []

  if (tableData.value.length === 0) {
    refreshArg.value = null
    return
  }

  refreshArg.value = {
    ...args[0],
    cookiesBuffer: data.cookiesBuffer,
    currentPage: data.currentPage,
    lastBuff: data.lastBuff,
    offset: data.offset,
  }
}

onSuccessVideoSearch(({ args, data }) => {
  successCallback(data, args)
})
onSuccessAuthorSearch(({ args, data }) => {
  successCallback(data, args)
})
onSuccessImageSearch(({ data }) => {
  tableData.value = data.handSearchDTOs ?? []

  if (tableData.value.length === 0) {
    refreshArg.value = null
    return
  }

  refreshArg.value = {
    cookiesBuffer: data.cookiesBuffer,
    currentPage: data.currentPage,
    keyword: data.searchWord,
    lastBuff: data.lastBuff,
    offset: data.offset,
    taskId: props.taskId,
    toolType: data.toolType,
  }
})

async function handleSubmit(): Promise<void> {
  if (selectedRowKeys.value.length === 0) {
    $msg.error('请选择视频')
    await Promise.reject()
  }

  await alovaInst.Post('task/taskContent/handSearchSave', {
    keyword: refreshArg.value!.keyword,
    taskId: refreshArg.value!.taskId,
    toolType: refreshArg.value!.toolType,
    videoIds: selectedRowKeys.value,
  })
  $msg('视频添加成功')
}

function refresh(): void {
  send(refreshArg.value!)
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div>
    <div class="mb-3 flex items-end justify-between">
      <TButton @click="handleSelectSearchType">选择搜索类型</TButton>
      <div>
        <div v-if="currentSearchConfig" class="flex flex-col items-start gap-2">
          <div v-if="currentSearchConfig.keyword && currentSearchConfig.type !== '3'">
            <span class="mr-2">当前搜索文字:</span>
            <span>
              {{ currentSearchConfig.keyword }}
            </span>
          </div>
          <div v-if="currentSearchConfig.authorLabel">
            <span class="mr-2">当前搜索作者名称:</span>
            <span>
              {{ currentSearchConfig.authorLabel }}
            </span>
          </div>
          <div v-if="currentSearchConfig.imageUrl" class="flex items-center">
            <span class="mr-2" style="word-break: keep-all">当前搜索图片:</span>
            <div class="h-[100px] w-[100px]">
              <TImageViewer :images="[currentSearchConfig.imageUrl]"></TImageViewer>
            </div>
          </div>
        </div>
      </div>
      <div>
        <TButton v-if="refreshArg" @click="refresh">换一批</TButton>
      </div>
    </div>
    <TTable
      v-model:selected-row-keys="selectedRowKeys"
      :columns="columns"
      :data="tableData"
      show-row-select="multiple"
    ></TTable>
  </div>
</template>
