<script setup lang="ts">
// import { fillOriginalUrl as fillOriginalUrlApi, getContentInfoById } from '@/api/alova/data'
// import CVideo from '@/components/global/CVideo.vue'

const props = withDefaults(
  defineProps<{
    data: Record<string, any>
  }>(),
  {},
)
const emit = defineEmits<{
  'update:originalUrl': []
}>()
const sliceData = computed(() => {
  let arr

  try {
    arr = JSON.parse(props.data.aiText || props.data.contentText)
  } catch (error) {
    console.log(error)
    arr = []
  }

  return arr ?? []
})
const tableData = computed(() => {
  return sliceData.value.map((item: any) => {
    console.log(item)
    return {
      ...item,
      duration: `${dayjs(item.end_time, 'HH:mm:ss').diff(dayjs(item.start_time, 'HH:mm:ss'), 'seconds')}s`,
      startEndTime: [item.start_time, item.end_time].join(' - '),
    }
  })
})
const getByIdOriginalUrl = ref<null | string>(null)

async function fillOriginalUrl(): Promise<void> {
  await $confirm('确定要添加原链接吗？')

  const contentId = props.data.contentId ?? props.data.id

  await alovaInst.Post(
    'data/contentInfo/fillOriginalUrl',
    {
      contentIdList: [contentId],
      detailFill: true, // 详情添加时，后端查找的页数多一点
    },
    {
      meta: {
        useLoading: '正在添加原链接...',
      },
      timeout: 0,
    },
  )
  emit('update:originalUrl')

  const res = await alovaInst.Get<Record<string, any>>(`data/contentInfo/${contentId}`)

  getByIdOriginalUrl.value = res.originalUrl
  $msg('添加原链接成功')
}

const finallyOriginalUrl = computed(() => {
  return getByIdOriginalUrl.value ?? props.data.originalUrl
})
</script>

<template>
  <TCard title="内容切片总结">
    <template #actions>
      <TLink v-if="finallyOriginalUrl" v-copy="finallyOriginalUrl" class="mr-4!">
        复制原链接
      </TLink>
      <TLink
        v-else-if="checkPermissions('data:contentInfo:fillOriginalUrl')"
        class="mr-4!"
        @click="fillOriginalUrl"
      >
        添加原链接
      </TLink>
      <TLink v-if="data.url" :href="data.url" download>下载视频</TLink>
    </template>
    <div class="grid grid-cols-2 gap-4" style="height: 360px">
      <TTable
        :columns="[
          { colKey: 'line', title: '视频段' },
          { colKey: 'startEndTime', title: '内容时间段' },
          { colKey: 'duration', title: '时长' },
          { colKey: 'short_content', title: 'Ai切片总结', resize: { maxWidth: 600 } },
        ]"
        :data="tableData"
        flex-height
      ></TTable>
      <video
        v-if="data.url"
        class="mx-auto"
        controls
        preload="metadata"
        style="height: 360px; object-fit: contain"
      >
        <source :src="data.url" type="video/mp4" />
      </video>
    </div>
  </TCard>
</template>
