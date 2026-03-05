<script setup lang="ts">
import { saveAs } from '@/utils/tool'

const props = withDefaults(
  defineProps<{
    canvasList: HTMLCanvasElement[]
    data: Record<string, any>
    id: string
    reqContent: string
  }>(),
  {},
)
const imgSrcList = computed(() => {
  return props.canvasList.map((canvas) => {
    return canvas.toDataURL('image/png')
  })
})
const formData: Record<string, any> = reactive({
  imgIndexList: imgSrcList.value.map((_, index) => index),
  reportType: '1',
})
const formItems: FormItem[] = [
  {
    _label: '请选择报告的图片',
    slot: 'imgIndexList',
  },
  {
    _label: '报告类型',
    component: 'TRadioGroup',
    model: 'reportType',
    options: [
      {
        label: '模型分析报告',
        value: '1',
      },
      {
        label: '页面快照报告',
        value: '2',
      },
    ],
  },
]

function getMergedCanvas(): HTMLCanvasElement {
  const canvasArr = props.canvasList.filter((_, index) => formData.imgIndexList.includes(index))
  const mergedCanvas = document.createElement('canvas')
  const margin = 24

  mergedCanvas.width = Math.max(...canvasArr.map((c) => c.width))
  mergedCanvas.height =
    canvasArr.reduce((acc, c) => acc + c.height, 0) + (canvasArr.length - 1) * margin

  const ctx = mergedCanvas.getContext('2d')!

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height)
  canvasArr.forEach((c, index) => {
    ctx.drawImage(
      c,
      0,
      canvasArr.slice(0, index).reduce((acc, c) => acc + c.height, 0) + index * margin,
    )
  })
  return mergedCanvas
}

function handleSelect(index: number): void {
  if (formData.imgIndexList.includes(index)) {
    formData.imgIndexList = formData.imgIndexList.filter((i: number) => i !== index)
  } else {
    formData.imgIndexList.push(index)
  }
}

function handleSubmit(): Promise<void> {
  return new Promise((resolve) => {
    if (formData.imgIndexList.length === 0) {
      $msg.error('请选择报告的图片')
      return
    }

    const mergedCanvas = getMergedCanvas()
    const pngName = `${props.data.id}_舆情分析快照_${new Date().valueOf()}.png`

    if (formData.reportType === '1') {
      mergedCanvas.toBlob((b) => {
        const file = new File([b!], pngName, {
          type: 'image/png',
        })

        alovaInst
          .Post(
            'common/uploadOss',
            {
              biz: '可以随时删除的',
              file,
            },
            {
              meta: {
                useFormData: true,
              },
            },
          )
          .then((url) => {
            alovaInst
              .Post(
                'yq/aiSuggestion/aiReport',
                {
                  agentType: 8,
                  brandId: props.data.brandId,
                  contentId: props.id,
                  fileUrl: url,
                  reqContent: props.reqContent,
                },
                {
                  meta: {
                    useDownload: `${props.data.name}_舆情分析报告_${new Date().valueOf()}.pdf`,
                    useLoading: '生成报告中...',
                  },
                },
              )
              .then(() => {
                resolve()
              })
          })
      })
    } else {
      saveAs(mergedCanvas.toDataURL('image/png'), pngName)
      resolve()
    }
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <TForm :data="formData" :items="formItems" layout="vertical">
    <template #imgIndexList>
      <div class="img_wrapper">
        <a
          v-for="(src, index) in imgSrcList"
          :key="index"
          href="javascript:void(0)"
          :class="{
            selected: formData.imgIndexList.includes(index),
          }"
          @click="handleSelect(index)"
        >
          <TCheckbox :model-value="formData.imgIndexList.includes(index)"></TCheckbox>
          <img :src="src" />
        </a>
      </div>
    </template>
  </TForm>
</template>

<style scoped>
.img_wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  > a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 1px dashed #e0e0e0;

    &.selected {
      border-color: var(--td-brand-color);
    }

    .t-checkbox {
      position: absolute;
      top: 8px;
      right: 0;
    }
  }

  img {
    max-width: 100%;
  }
}
</style>
