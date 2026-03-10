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
    return {
      ...item,
      duration: `${dayjs(item.end_time, 'HH:mm:ss').diff(dayjs(item.start_time, 'HH:mm:ss'), 'seconds')}s`,
      startEndTime: [item.start_time, item.end_time].join(' - '),
    }
  })
})
const videoRef = ref<InstanceType<typeof CVideo> | null>(null)

function currentChange({ row }: { row: TableRowData }): void {
  const startTime = dayjs(row.start_time, 'HH:mm:ss').diff(dayjs('00:00:00', 'HH:mm:ss'), 'seconds')

  videoRef.value?.player!.currentTime(startTime)
}

watchEffect(() => {
  const arr = sliceData.value.map((item: any) => {
    return {
      overlayText: item.short_content,
      text: item.short_content,
      time: dayjs(item.start_time, 'HH:mm:ss').diff(dayjs('00:00:00', 'HH:mm:ss'), 'seconds'),
    }
  })

  // @ts-expect-error markers
  videoRef.value?.player!.markers({
    breakOverlay: {
      display: false,
      displayTime: 3,
      style: {
        'background-color': 'rgba(0,0,0,0.7)',
        color: 'white',
        'font-size': '17px',
        height: '20%',
        width: '100%',
      },
      text(marker: any) {
        return marker.overlayText
      },
    },
    markers: arr,
    markerStyle: {
      'background-color': 'red',
      'border-radius': '50%',
      width: '4px',
    },
    markerTip: {
      display: true,
      text(marker: any) {
        return marker.text
      },
      time(marker: any) {
        return marker.time
      },
    },
  })
})

const getByIdOriginalUrl = ref<null | string>(null)

async function fillOriginalUrl(): Promise<void> {
  await $confirm('确定要添加原链接吗？')
  await fillOriginalUrlApi({
    contentIdList: [props.data.contentId ?? props.data.id],
    detailFill: true, // 详情添加时，后端查找的页数多一点
  })
  emit('update:originalUrl')

  const res = await getContentInfoById(props.data.contentId ?? props.data.id)

  getByIdOriginalUrl.value = res.originalUrl
  $notify('添加原链接成功')
}

const finallyOriginalUrl = computed(() => {
  return getByIdOriginalUrl.value ?? props.data.originalUrl
})
</script>

<template>
  <TCard title="内容切片总结" class="mt-4!">
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
      <CVideo
        v-if="data.url"
        ref="videoRef"
        :sources="[
          {
            src: data.url,
            type: 'video/mp4',
          },
        ]"
        height="360"
      ></CVideo>
    </div>
  </TCard>
</template>
