<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    hasOriginalUrlArr: Array<Record<string, any>>
    noneOriginalUrlArr: Array<Record<string, any>>
  }>(),
  {},
)
const columns: TableCol[] = [
  {
    ...useVideoTitleColumn({
      useLink: false,
    }),
    resize: {
      maxWidth: 400,
    },
  },
  {
    colKey: 'publishTime',
    title: '发布时间',
  },
  useAuthorNameColumn({
    useLink: false,
  }),
]

async function handleSubmit(): Promise<void> {
  await alovaInst.Post(
    'data/contentInfo/fillOriginalUrl',
    {
      contentIdList: props.noneOriginalUrlArr.map((item) => item.contentId),
    },
    {
      meta: {
        useLoading: '正在添加原链接...',
      },
      timeout: 0,
    },
  )
  $msg('添加原链接成功')
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div v-if="hasOriginalUrlArr.length > 0" class="mb-4">
    以下选项已经添加原链接，无需再添加：
    <TTable :columns="columns" :data="hasOriginalUrlArr"></TTable>
  </div>
  <div v-if="noneOriginalUrlArr.length > 0">
    确定要继续添加原链接的视频：
    <TTable :columns="columns" :data="noneOriginalUrlArr"></TTable>
  </div>
</template>
