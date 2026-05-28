import type { LoadingInstance } from 'tdesign-vue-next'
import type { Ref } from 'vue'
import type { CreateMessageFnType } from './$msg'
import { BProgress } from '@bprogress/core'
// @ts-expect-error css 文件
import '@bprogress/core/css'

type LoadingText = Parameters<CreateMessageFnType>[0]
BProgress.configure({
  // indeterminate: true,
  showSpinner: false,
})

class LoadingService {
  public isLoading = ref(false)
  private loadingCount = 0
  private loadingInstance: LoadingInstance | null = null
  private loadingText: Ref<LoadingText | undefined> = ref(undefined)

  changeView() {
    if (this.loadingCount > 0) {
      this.isLoading.value = true

      if (this.loadingInstance === null) {
        this.loadingInstance = LoadingPlugin(
          {
            fullscreen: true,
            indicator: false,
            text: (h) => {
              if (this.loadingText.value === undefined) {
                return null
              }

              return h(TMessage, {
                content: this.loadingText.value,
                duration: 0,
                theme: 'loading',
              })
            },
          },
          useAppContext(),
        )

        if (!BProgress.isStarted()) {
          BProgress.start()
        }
      }
    } else {
      this.isLoading.value = false

      if (this.loadingCount < 0) {
        throw new Error('loadingCount 不能小于 0')
      }

      this.loadingInstance!.hide()
      this.loadingInstance = null
      this.loadingText.value = undefined
      BProgress.done()
    }
  }

  hide() {
    setTimeout(() => {
      this.loadingCount--
      this.changeView()
    }, 80)
  }

  show(text?: LoadingText) {
    this.loadingCount++

    if (text !== undefined) {
      this.loadingText.value = text
    }

    this.changeView()
  }
}

export default new LoadingService()
