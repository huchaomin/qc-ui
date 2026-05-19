<script setup lang="ts">
import { aesEncrypt } from '@/utils/tool'

const emit = defineEmits<{
  success: [captchaVerification: string]
}>()
const imgHeight = 155
const sizeConfig = {
  barHeight: 40,
  imgHeight,
  imgWidth: imgHeight * 2,
}
const defaultImg = new URL('./default.jpg', import.meta.url).href
const backImgBase64 = ref<null | string>('')
const blockBackImgBase64 = ref<null | string>('')
const tipWords = ref('') // 图片下面的提示语
const barAreaRef = useTemplateRef('barArea')
const checkState = ref<'default' | 'doing' | 'fail' | 'success'>('default')
const styleByState = computed(() => {
  if (checkState.value === 'default') {
    return {
      bgColor: 'inherit',
      color: 'var(--td-text-color-secondary)',
      icon: 'icon-right',
    }
  } else if (checkState.value === 'doing') {
    return {
      bgColor: 'var(--td-brand-color-active)',
      color: '#fff',
      icon: 'icon-right',
    }
  } else if (checkState.value === 'success') {
    return {
      bgColor: 'var(--td-success-color)',
      color: '#fff',
      icon: 'icon-check',
    }
  } else {
    return {
      bgColor: '#d9534f',
      color: '#fff',
      icon: 'icon-close',
    }
  }
})
const startMoveTime = ref(0)
const backToken = ref<string>('')
const secretKey = ref<string>('')
const dragBlockRef = useTemplateRef('dragBlock')
const { width: barAreaWidth } = useElementSize(barAreaRef, undefined, {
  box: 'border-box',
})
const { x: _x } = useDraggable(dragBlockRef, {
  axis: 'x',
  containerElement: barAreaRef,
  onEnd: async ({ x }) => {
    console.log(x)

    const endMoveTime = Date.now()
    const res = await alovaInst.Post<Record<string, any>>(
      'captcha/check',
      {
        pointJson: await aesEncrypt(JSON.stringify({ x, y: 5.0 }), secretKey.value),
        token: backToken.value,
      },
      {
        meta: {
          useLoading: false,
          useToken: false,
        },
      },
    )

    if (res.repCode === '0000') {
      checkState.value = 'success'
      tipWords.value = `${((endMoveTime - startMoveTime.value) / 1000).toFixed(2)}s验证成功`
      setTimeout(async () => {
        emit(
          'success',
          await aesEncrypt(
            `${backToken.value}---${JSON.stringify({ x, y: 5.0 })}`,
            secretKey.value,
          ),
        )
      }, 500)
    } else {
      checkState.value = 'fail'
      tipWords.value = '验证失败'
      setTimeout(() => {
        refresh()
      }, 1000)
    }
  },
  onStart: () => {
    if (secretKey.value === '') {
      return false
    }

    startMoveTime.value = Date.now() // 开始滑动的时间
    checkState.value = 'doing'
  },
  stopPropagation: true,
})
const x = computed(() => {
  return Math.min(_x.value, barAreaWidth.value - sizeConfig.barHeight)
})
const { loading: getCaptchaLoading, send: getCaptchaSend } = useRequest(
  alovaInst.Post<Record<string, any>>(
    'captcha/get',
    {},
    {
      meta: {
        useLoading: false,
        useToken: false,
      },
    },
  ),
  {
    immediate: false,
  },
)

async function getPicture() {
  const res = await getCaptchaSend()

  if (res.repCode === '0000') {
    backImgBase64.value = res.repData.originalImageBase64
    blockBackImgBase64.value = res.repData.jigsawImageBase64
    backToken.value = res.repData.token
    secretKey.value = res.repData.secretKey
  } else {
    tipWords.value = res.repMsg
    backImgBase64.value = null
    blockBackImgBase64.value = null
    backToken.value = ''
    secretKey.value = ''
  }
}

onMounted(() => {
  getPicture()
})

function refresh() {
  tipWords.value = ''
  _x.value = 0
  checkState.value = 'default'
  secretKey.value = ''
  getPicture()
}
</script>

<template>
  <div
    v-loading="getCaptchaLoading"
    class="relative overflow-hidden"
    :style="{ width: `${sizeConfig.imgWidth}px` }"
    @selectstart="() => false"
  >
    <div class="relative" :style="{ height: `${sizeConfig.imgHeight}px` }">
      <img
        :src="backImgBase64 ? `data:image/png;base64,${backImgBase64}` : defaultImg"
        class="block h-full w-full"
      />
      <TButton class="absolute! top-0 right-0" variant="text" shape="square" @click="refresh">
        <template #icon>
          <Icon icon="material-symbols-light:refresh"></Icon>
        </template>
      </TButton>
      <span
        v-if="tipWords"
        class="text-white absolute bottom-0 left-0 w-full p-1"
        :class="checkState === 'success' ? 'bg-green-300/50' : 'bg-red-300/50'"
        >{{ tipWords }}</span
      >
    </div>
    <div
      ref="barArea"
      class="border-gray-300 relative mt-[4px] flex items-center justify-center border text-center"
      :style="{
        height: `${sizeConfig.barHeight}px`,
      }"
    >
      <span v-show="checkState === 'default'">向右滑动完成验证</span>
      <div
        class="absolute top-0 left-0 -translate-x-px -translate-y-px border bg-[#f0fff0]"
        :style="{
          width: x === 0 ? `${sizeConfig.barHeight}px` : `${x + 1}px`,
          height: `${sizeConfig.barHeight}px`,
          'border-color': styleByState.bgColor,
        }"
      >
        <div
          ref="dragBlock"
          class="hover:text-white absolute top-0 left-0 flex -translate-x-px -translate-y-px cursor-pointer items-center justify-center border border-transparent bg-clip-content hover:bg-(--td-brand-color)"
          :style="{
            width: `${sizeConfig.barHeight}px`,
            height: `${sizeConfig.barHeight}px`,
            'background-color': styleByState.bgColor,
            left: `${x}px`,
          }"
        >
          <Icon
            v-if="styleByState.icon === 'icon-check'"
            icon="mdi:check"
            :style="{ color: styleByState.color }"
          ></Icon>
          <Icon
            v-if="styleByState.icon === 'icon-right'"
            icon="mdi:chevron-right"
            :style="{ color: styleByState.color }"
          ></Icon>
          <Icon
            v-if="styleByState.icon === 'icon-close'"
            icon="mdi:close"
            :style="{ color: styleByState.color }"
          ></Icon>
        </div>
        <div
          class="absolute left-0"
          :style="{
            width: `${(sizeConfig.imgWidth * 47) / 310}px`,
            height: `${sizeConfig.imgHeight}px`,
            top: `-${sizeConfig.imgHeight + 4}px`,
            left: `${x}px`,
          }"
        >
          <img :src="`data:image/png;base64,${blockBackImgBase64}`" class="block h-full w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
