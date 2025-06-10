import type { LoadingInstance } from 'tdesign-vue-next'
import type { CreateMessageFnType } from './$msg'

type LoadingText = Parameters<CreateMessageFnType>[0]

class LoadingService {
  private loadingCount = 0
  private loadingInstance: LoadingInstance | null = null
  private loadingText: Ref<LoadingText | undefined> = ref(undefined)

  changeView() {
    if (this.loadingCount > 0) {
      if (this.loadingInstance === null) {
        this.loadingInstance = LoadingPlugin({
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
        })
      }
    }
    else {
      if (this.loadingCount < 0) {
        throw new Error('loadingCount 不能小于 0')
      }

      this.loadingInstance!.hide()
      this.loadingInstance = null
      this.loadingText.value = undefined
    }
  }

  hide() {
    this.loadingCount--
    this.changeView()
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
