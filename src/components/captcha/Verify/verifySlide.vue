<script type="text/babel">
import { checkCaptcha, getCaptcha } from '@/api/captcha'
/**
 * VerifySlide
 * @description 滑块
 */
import { aesEncrypt } from './../utils/ase.js'

export default {
  props: {
    explain: {
      default: '向右滑动完成验证',
      type: String,
    },
  },
  data() {
    return {
      secretKey: "", //后端返回的加密秘钥 字段
      passFlag: "", //是否通过的标识
      backImgBase: "", //验证码背景图片
      blockBackImgBase: "", //验证滑块的背景图片
      backToken: "", //后端返回的唯一token值
      startMoveTime: "", //移动开始的时间
      endMovetime: "", //移动结束的时间
      tipWords: "",
      text: "",
      setSize: {
        barHeight: '40px',
        barWidth: '310px',
        imgHeight: '155px',
        imgWidth: '310px',
      },
      top: 0,
      left: 0,
      moveBlockLeft: undefined,
      leftBarWidth: undefined,
      // 移动中样式
      moveBlockBackgroundColor: undefined,
      leftBarBorderColor: "#ddd",
      iconColor: undefined,
      iconClass: "icon-right",
      status: false, //鼠标状态
      isEnd: false, //是够验证完成
      showRefresh: true,
      transitionLeft: "",
      transitionWidth: "",
      defaultImg: new URL('./default.jpg', import.meta.url).href,
    };
  },
  computed: {
    barArea() {
      return this.$el.querySelector(".verify_bar_area");
    },
  },
  methods: {
    // 鼠标松开
    end() {
      this.endMovetime = +new Date()
      let _this = this

      // 判断是否重合
      if (this.status && this.isEnd == false) {
        let moveLeftDistance = Number.parseInt(
          (this.moveBlockLeft || '').replace('px', ''),
        )
        moveLeftDistance
          = (moveLeftDistance * 310) / Number.parseInt(this.setSize.imgWidth)
        let data = {
          captchaType: 'blockPuzzle',
          pointJson: this.secretKey
            ? aesEncrypt(
                JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
                this.secretKey,
              )
            : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: this.backToken,
        }
        checkCaptcha(data).then((res) => {
          if (res.repCode == '0000') {
            this.moveBlockBackgroundColor = '#5cb85c'
            this.leftBarBorderColor = '#5cb85c'
            this.iconColor = '#fff'
            this.iconClass = 'icon-check'
            this.showRefresh = false
            this.isEnd = true
            this.passFlag = true
            this.tipWords = `${(
              (this.endMovetime - this.startMoveTime)
              / 1000
            ).toFixed(2)}s验证成功`
            let captchaVerification = this.secretKey
              ? aesEncrypt(
                  `${this.backToken
                  }---${
                    JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`,
                  this.secretKey,
                )
              : `${this.backToken
              }---${
                JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`
            setTimeout(() => {
              this.tipWords = ''
              this.$parent.closeBox()
              this.$parent.$emit('success', { captchaVerification })
            }, 1000)
          }
          else {
            this.moveBlockBackgroundColor = '#d9534f'
            this.leftBarBorderColor = '#d9534f'
            this.iconColor = '#fff'
            this.iconClass = 'icon-close'
            this.passFlag = false
            setTimeout(() => {
              _this.refresh()
            }, 1000)
            this.$parent.$emit('error', this)
            this.tipWords = '验证失败'
            setTimeout(() => {
              this.tipWords = ''
            }, 1000)
          }
        })
        this.status = false
      }
    },

    getEx(e) {
      let x = 0

      if (e.touches) {
        // 兼容移动端
        x = e.touches[0].clientX
      }
      else {
        // 兼容PC端
        x = e.clientX
      }

      return x
    },
    // 请求背景图片和验证图片
    async getPicture() {
      const res = await getCaptcha({})

      if (res.repCode === '0000') {
        this.backImgBase = res.repData.originalImageBase64
        this.blockBackImgBase = res.repData.jigsawImageBase64
        this.backToken = res.repData.token
        this.secretKey = res.repData.secretKey
      }
      else {
        this.tipWords = res.repMsg
      }

      // 判断接口请求次数是否失效
      if (res.repCode === '6201') {
        this.backImgBase = null
        this.blockBackImgBase = null
      }
    },

    init() {
      this.text = this.explain
      this.getPicture()
      window.addEventListener('touchmove', (e) => {
        this.move(e)
      })
      window.addEventListener('mousemove', (e) => {
        this.move(e)
      })
      // 鼠标松开
      window.addEventListener('touchend', () => {
        this.end()
      })
      window.addEventListener('mouseup', () => {
        this.end()
      })
    },

    // 鼠标移动
    move(e) {
      if (this.status && this.isEnd === false) {
        console.log(e)
        const x = this.getEx(e)
        let moveBlockLeft = x - this.barArea.getBoundingClientRect().left // 小方块相对于父元素的left值

        if (moveBlockLeft >= this.barArea.offsetWidth - 40 + this.startLeft) {
          moveBlockLeft = this.barArea.offsetWidth - 40 + this.startLeft
        }

        if (moveBlockLeft <= this.startLeft) {
          moveBlockLeft = this.startLeft
        }

        // 拖动后小方块的left值
        this.moveBlockLeft = `${moveBlockLeft - this.startLeft}px`
        this.leftBarWidth = `${moveBlockLeft - this.startLeft}px`
      }
    },

    refresh() {
      this.showRefresh = true
      this.transitionLeft = 'left 3s'
      this.moveBlockLeft = 0
      this.leftBarWidth = undefined
      this.transitionWidth = 'width 3s'
      this.leftBarBorderColor = '#ddd'
      this.moveBlockBackgroundColor = '#fff'
      this.iconColor = '#000'
      this.iconClass = 'icon-right'
      this.isEnd = false
      this.getPicture()
      setTimeout(() => {
        this.transitionWidth = ''
        this.transitionLeft = ''
        this.text = this.explain
      }, 300)
    },

    // 鼠标按下
    start(e) {
      const x = this.getEx(e)
      this.startLeft = x - this.barArea.getBoundingClientRect().left
      this.startMoveTime = +new Date() // 开始滑动的时间

      if (this.isEnd === false) {
        this.text = ''
        this.moveBlockBackgroundColor = '#337ab7'
        this.leftBarBorderColor = '#337AB7'
        this.iconColor = '#fff'
        this.status = true
        e.stopPropagation()
      }
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<template>
  <div
    class="relative overflow-hidden"
    :style="{ width: setSize.imgWidth }"
    @selectstart="() => false"
  >
    <div
      class="relative"
      :style="{ height: setSize.imgHeight }"
    >
      <img
        :src="backImgBase ? `data:image/png;base64,${backImgBase}` : defaultImg"
        class="block w-full h-full"
      />
      <TButton
        v-show="showRefresh"
        class="absolute top-0 right-0"
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
        :class="passFlag ? 'bg-green-300/50' : 'bg-red-300/50'"
      >{{ tipWords }}</span>
    </div>
    <div
      class="mt-[8px] verify_bar_area relative text-center flex items-center justify-center border border-gray-300"
      :style="{
        height: setSize.barHeight,
      }"
    >
      <span>{{ text }}</span>
      <div
        class="absolute top-0 left-0 bg-[#f0fff0] border transition-transform translate-x-[-1px] translate-y-[-1px]"
        :style="{
          'width': leftBarWidth !== undefined ? leftBarWidth : setSize.barHeight,
          'height': setSize.barHeight,
          'border-color': leftBarBorderColor,
          'transition': transitionWidth,
        }"
      >
        <div
          class="absolute top-0 left-0 cursor-pointer bg-white bg-clip-content
          border border-transparent transition-transform translate-x-[-1px] translate-y-[-1px]
          hover:text-white hover:bg-primary flex items-center justify-center"
          :style="{
            'width': setSize.barHeight,
            'height': setSize.barHeight,
            'background-color': moveBlockBackgroundColor,
            'left': moveBlockLeft,
            'transition': transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i-material-symbols:check v-if="iconClass === 'icon-check'" :style="{ color: iconColor }"></i-material-symbols:check>
          <i-material-symbols:chevron-right v-if="iconClass === 'icon-right'" :style="{ color: iconColor }"></i-material-symbols:chevron-right>
          <i-material-symbols:cancel-outline-rounded v-if="iconClass === 'icon-close'" :style="{ color: iconColor }"></i-material-symbols:cancel-outline-rounded>
        </div>
        <div
          class="absolute left-0"
          :style="{
            width: `${(parseInt(setSize.imgWidth) * 47) / 310}px`,
            height: setSize.imgHeight,
            top: `-${parseInt(setSize.imgHeight) + 8}px`,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
        >
          <img
            :src="`data:image/png;base64,${blockBackImgBase}`"
            class="block w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
