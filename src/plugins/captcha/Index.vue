<script setup lang="ts">
import { checkCaptcha, getCaptcha } from './api'

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
const moveBlockLeft = ref(0)

function getEx(e: MouseEvent | TouchEvent) {
  let x = 0

  if ((e as TouchEvent).touches) {
  // 兼容移动端
    x = (e as TouchEvent).touches[0].clientX
  }
  else {
  // 兼容PC端
    x = (e as MouseEvent).clientX
  }

  return x
}

const barAreaRef = useTemplateRef('barArea')

function getBarAreaLeft() {
  return barAreaRef.value!.getBoundingClientRect().left
}

const checkState = ref<'default' | 'doing' | 'fail' | 'success'>('default')
const styleByState = computed(() => {
  if (checkState.value === 'default') {
    return {
      bgColor: 'inherit',
      color: 'var(--td-text-color-secondary)',
      icon: 'icon-right',
    }
  }
  else if (checkState.value === 'doing') {
    return {
      bgColor: 'var(--td-brand-color-active)',
      color: '#fff',
      icon: 'icon-right',
    }
  }
  else if (checkState.value === 'success') {
    return {
      bgColor: 'var(--td-success-color)',
      color: '#fff',
      icon: 'icon-check',
    }
  }
  else {
    return {
      bgColor: '#d9534f',
      color: '#fff',
      icon: 'icon-close',
    }
  }
})
const startLeft = ref(0)
const startMoveTime = ref(0)

function start(e: MouseEvent | TouchEvent): void {
  const x = getEx(e)
  startLeft.value = x - getBarAreaLeft()
  startMoveTime.value = +new Date() // 开始滑动的时间
  checkState.value = 'doing'
  e.stopPropagation()
}

const backToken = ref<string>('')
const secretKey = ref<string>('')
const { send: checkCaptchaSend } = useRequest(checkCaptcha, {
  immediate: false,
})

async function end() {
  if (checkState.value === 'doing') {
    const moveLeftDistance = moveBlockLeft.value
    const endMoveTime = +new Date()
    const res = await checkCaptchaSend({
      pointJson: await aesEncrypt(
        JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        secretKey.value,
      ),
      token: backToken.value,
    })

    if (res.repCode === '0000') {
      checkState.value = 'success'
      tipWords.value = `${(
        (endMoveTime - startMoveTime.value)
        / 1000
      ).toFixed(2)}s验证成功`
      setTimeout(async () => {
        emit('success', await aesEncrypt(`${backToken.value}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`, secretKey.value))
      }, 500)
    }
    else {
      checkState.value = 'fail'
      tipWords.value = '验证失败'
      setTimeout(() => {
        refresh()
      }, 1000)
    }
  }
}

const { loading: getCaptchaLoading, send: getCaptchaSend } = useRequest(getCaptcha, {
  immediate: false,
})

async function getPicture() {
  const res = await getCaptchaSend({})

  if (res.repCode === '0000') {
    backImgBase64.value = res.repData.originalImageBase64
    blockBackImgBase64.value = res.repData.jigsawImageBase64
    backToken.value = res.repData.token
    secretKey.value = res.repData.secretKey
  }
  else {
    tipWords.value = res.repMsg
  }

  // 判断接口请求次数是否失效
  if (res.repCode === '6201') {
    backImgBase64.value = null
    blockBackImgBase64.value = null
  }
}

function move(e: MouseEvent | TouchEvent): void {
  if (checkState.value === 'doing') {
    const x = getEx(e)
    let moveLeft = x - getBarAreaLeft()

    if (moveLeft >= sizeConfig.imgWidth - 40 + startLeft.value) {
      moveLeft = sizeConfig.imgWidth - 40 + startLeft.value
    }

    if (moveLeft <= startLeft.value) {
      moveLeft = startLeft.value
    }

    // 拖动后小方块的left值
    moveBlockLeft.value = moveLeft - startLeft.value
  }
}

onMounted(() => {
  getPicture()
  window.addEventListener('touchmove', move)
  window.addEventListener('mousemove', move)
  // 鼠标松开
  window.addEventListener('touchend', end)
  window.addEventListener('mouseup', end)
})
onUnmounted(() => {
  window.removeEventListener('touchmove', move)
  window.removeEventListener('mousemove', move)
  window.removeEventListener('touchend', end)
  window.removeEventListener('mouseup', end)
})

function refresh() {
  tipWords.value = ''
  moveBlockLeft.value = 0
  checkState.value = 'default'
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
    <div
      class="relative"
      :style="{ height: `${sizeConfig.imgHeight}px` }"
    >
      <img
        :src="backImgBase64 ? `data:image/png;base64,${backImgBase64}` : defaultImg"
        class="block w-full h-full"
      />
      <TButton
        class="!absolute top-0 right-0"
        variant="text"
        shape="square"
        @click="refresh"
      >
        <template #icon>
          <i-material-symbols:refresh></i-material-symbols:refresh>
        </template>
      </TButton>
      <span
        v-if="tipWords"
        class="absolute bottom-0 left-0 w-full p-1 text-white"
        :class="checkState === 'success' ? 'bg-green-300/50' : 'bg-red-300/50'"
      >{{ tipWords }}</span>
    </div>
    <div
      ref="barArea"
      class="mt-[4px] relative text-center flex items-center justify-center border border-gray-300"
      :style="{
        height: `${sizeConfig.barHeight}px`,
      }"
    >
      <span v-show="checkState === 'default'">向右滑动完成验证</span>
      <div
        class="absolute top-0 left-0 bg-[#f0fff0] border translate-x-[-1px] translate-y-[-1px]"
        :style="{
          'width': moveBlockLeft === 0 ? `${sizeConfig.barHeight}px` : `${moveBlockLeft}px`,
          'height': `${sizeConfig.barHeight}px`,
          'border-color': styleByState.bgColor,
        }"
      >
        <div
          class="absolute top-0 left-0 cursor-pointer bg-clip-content
          border border-transparent translate-x-[-1px] translate-y-[-1px]
          hover:text-white hover:bg-primary flex items-center justify-center"
          :style="{
            'width': `${sizeConfig.barHeight}px`,
            'height': `${sizeConfig.barHeight}px`,
            'background-color': styleByState.bgColor,
            'left': `${moveBlockLeft}px`,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i-material-symbols:check v-if="styleByState.icon === 'icon-check'" :style="{ color: styleByState.color }"></i-material-symbols:check>
          <i-material-symbols:chevron-right v-if="styleByState.icon === 'icon-right'" :style="{ color: styleByState.color }"></i-material-symbols:chevron-right>
          <i-material-symbols:cancel-outline-rounded v-if="styleByState.icon === 'icon-close'" :style="{ color: styleByState.color }"></i-material-symbols:cancel-outline-rounded>
        </div>
        <div
          class="absolute left-0"
          :style="{
            width: `${(sizeConfig.imgWidth * 47 / 310)}px`,
            height: `${sizeConfig.imgHeight}px`,
            top: `-${(sizeConfig.imgHeight + 4)}px`,
            left: `${moveBlockLeft}px`,
          }"
        >
          <img
            :src="`data:image/png;base64,${blockBackImgBase64}`"
            class="block w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
