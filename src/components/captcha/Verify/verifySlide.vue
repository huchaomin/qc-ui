<script type="text/babel">
import { reqCheck, reqGet } from './../api/index.ts'
/**
 * VerifySlide
 * @description 滑块
 */
import { aesEncrypt } from './../utils/ase.js'
import { resetSize } from './../utils/util.js'

//  "captchaType":"blockPuzzle",
export default {
  computed: {
    barArea() {
      return this.$el.querySelector(".verify-bar-area");
    },
    resetSize() {
      return resetSize;
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
      tipsBackColor: "", //提示词的背景颜色
      tipWords: "",
      text: "",
      finishText: "",
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0,
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
    };
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
          captchaType: this.captchaType,
          pointJson: this.secretKey
            ? aesEncrypt(
                JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
                this.secretKey,
              )
            : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: this.backToken,
        }
        reqCheck(data).then((res) => {
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

    // 请求背景图片和验证图片
    getPictrue() {
      let data = {
        captchaType: this.captchaType,
        clientUid: localStorage.getItem('slider'),
        ts: Date.now(), // 现在的时间戳
      }
      reqGet(data).then((res) => {
        if (res.repCode == '0000') {
          this.backImgBase = res.repData.originalImageBase64
          this.blockBackImgBase = res.repData.jigsawImageBase64
          this.backToken = res.repData.token
          this.secretKey = res.repData.secretKey
        }
        else {
          this.tipWords = res.repMsg
        }

        // 判断接口请求次数是否失效
        if (res.repCode == '6201') {
          this.backImgBase = null
          this.blockBackImgBase = null
        }
      })
    },
    init() {
      this.text = this.explain
      this.getPictrue()
      this.$nextTick(() => {
        let setSize = this.resetSize(this) // 重新设置宽度高度

        for (let key in setSize) {
          this.setSize[key] = setSize[key]
        }

        this.$parent.$emit('ready', this)
      })
      let _this = this
      window.removeEventListener('touchmove', (e) => {
        _this.move(e)
      })
      window.removeEventListener('mousemove', (e) => {
        _this.move(e)
      })
      // 鼠标松开
      window.removeEventListener('touchend', () => {
        _this.end()
      })
      window.removeEventListener('mouseup', () => {
        _this.end()
      })
      window.addEventListener('touchmove', (e) => {
        _this.move(e)
      })
      window.addEventListener('mousemove', (e) => {
        _this.move(e)
      })
      // 鼠标松开
      window.addEventListener('touchend', () => {
        _this.end()
      })
      window.addEventListener('mouseup', () => {
        _this.end()
      })
    },

    // 鼠标移动
    move(e) {
      e = e || window.event

      if (this.status && this.isEnd == false) {
        if (!e.touches) {
          // 兼容PC端
          var x = e.clientX
        }
        else {
          // 兼容移动端
          var x = e.touches[0].pageX
        }

        let bar_area_left = this.barArea.getBoundingClientRect().left
        let move_block_left = x - bar_area_left // 小方块相对于父元素的left值

        if (
          move_block_left
          >= this.barArea.offsetWidth
          - Number.parseInt(Number.parseInt(this.blockSize.width) / 2)
          - 2
        ) {
          move_block_left
            = this.barArea.offsetWidth
              - Number.parseInt(Number.parseInt(this.blockSize.width) / 2)
              - 2
        }

        if (move_block_left <= 0) {
          move_block_left = Number.parseInt(Number.parseInt(this.blockSize.width) / 2)
        }

        // 拖动后小方块的left值
        this.moveBlockLeft = `${move_block_left - this.startLeft}px`
        this.leftBarWidth = `${move_block_left - this.startLeft}px`
      }
    },

    refresh() {
      this.showRefresh = true
      this.finishText = ''
      this.transitionLeft = 'left .3s'
      this.moveBlockLeft = 0
      this.leftBarWidth = undefined
      this.transitionWidth = 'width .3s'
      this.leftBarBorderColor = '#ddd'
      this.moveBlockBackgroundColor = '#fff'
      this.iconColor = '#000'
      this.iconClass = 'icon-right'
      this.isEnd = false
      this.getPictrue()
      setTimeout(() => {
        this.transitionWidth = ''
        this.transitionLeft = ''
        this.text = this.explain
      }, 300)
    },

    // 鼠标按下
    start(e) {
      e = e || window.event

      if (!e.touches) {
        // 兼容PC端
        var x = e.clientX
      }
      else {
        // 兼容移动端
        var x = e.touches[0].pageX
      }

      this.startLeft = Math.floor(
        x - this.barArea.getBoundingClientRect().left,
      )
      this.startMoveTime = +new Date() // 开始滑动的时间

      if (this.isEnd == false) {
        this.text = ''
        this.moveBlockBackgroundColor = '#337ab7'
        this.leftBarBorderColor = '#337AB7'
        this.iconColor = '#fff'
        e.stopPropagation()
        this.status = true
      }
    },
  },
  mounted() {
    // 禁止拖拽
    this.$el.onselectstart = function() {
      return false;
    };
  },
  name: "VerifySlide",
  props: {
    barSize: {
      default() {
        return {
          height: '40px',
          width: '310px',
        }
      },
      type: Object,
    },
    blockSize: {
      default() {
        return {
          height: '50px',
          width: '50px',
        }
      },
      type: Object,
    },
    captchaType: {
      type: String,
    },
    defaultImg: {
      default: '',
      type: String,
    },
    explain: {
      default: '向右滑动完成验证',
      type: String,
    },
    imgSize: {
      default() {
        return {
          height: '155px',
          width: '310px',
        }
      },
      type: Object,
    },
    // 弹出式pop，固定fixed
    mode: {
      default: 'fixed',
      type: String,
    },
    type: {
      default: '1',
      type: String,
    },
    vSpace: {
      default: 5,
      type: Number,
    },
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler(value) {
        console.log('🚀 ~ file: VerifySlide.vue:430 ~ handler ~ value:', value)
        this.init();
      },
    },
  },
}
</script>

<template>
  <div style="position: relative;">
    <div
      v-if="type === '2'"
      class="verify-img-out"
      :style="{ height: `${parseInt(setSize.imgHeight) + vSpace}px` }"
    >
      <div
        class="verify-img-panel"
        :style="{ width: setSize.imgWidth, height: setSize.imgHeight }"
      >
        <img
          :src="
            backImgBase ? `data:image/png;base64,${backImgBase}` : defaultImg
          "
          alt=""
          style=" display: block;width: 100%; height: 100%;"
        />
        <div
          v-show="showRefresh"
          class="verify-refresh"
          @click="refresh"
        >
          <i class="iconfont icon-refresh"></i>
        </div>
        <Transition name="tips">
          <span
            v-if="tipWords"
            class="verify-tips"
            :class="passFlag ? 'suc-bg' : 'err-bg'"
          >{{ tipWords }}</span>
        </Transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        'width': setSize.imgWidth,
        'height': barSize.height,
        'line-height': barSize.height,
      }"
    >
      <span
        class="verify-msg"
        v-text="text"
      ></span>
      <div
        class="verify-left-bar"
        :style="{
          'width': leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          'height': barSize.height,
          'border-color': leftBarBorderColor,
          'transaction': transitionWidth,
        }"
      >
        <span
          class="verify-msg"
          v-text="finishText"
        ></span>
        <div
          class="verify-move-block"
          :style="{
            'width': barSize.height,
            'height': barSize.height,
            'background-color': moveBlockBackgroundColor,
            'left': moveBlockLeft,
            'transition': transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i
            class="verify-icon iconfont" :class="[iconClass]"
            :style="{ color: iconColor }"
          ></i>
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{
              'width': `${Math.floor((parseInt(setSize.imgWidth) * 47) / 310)}px`,
              'height': setSize.imgHeight,
              'top': `-${parseInt(setSize.imgHeight) + vSpace}px`,
              'background-size': `${setSize.imgWidth} ${setSize.imgHeight}`,
            }"
          >
            <img
              :src="`data:image/png;base64,${blockBackImgBase}`"
              alt=""
              style=" display: block;width: 100%; height: 100%;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
