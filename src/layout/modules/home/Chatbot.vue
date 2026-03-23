<script setup lang="ts">
import type {
  AIMessageContent,
  ChatMessagesData,
  ChatServiceConfig,
  SSEChunkData,
  TdChatbotApi,
  TdChatMessageConfig,
} from '@tdesign-vue-next/chat'
import { getMessageContentForCopy, Chatbot as TChatbot } from '@tdesign-vue-next/chat'
import robotOutlineUrl from 'img/robot-outline.svg?url'

const sessionId = defineModel<string>('sessionId', {
  required: true,
})
const chatRef = ref<null | TdChatbotApi>(null)
// 默认初始化消息
const defaultMessages: ChatMessagesData[] = markRaw([
  {
    content: [
      {
        data: '我是炽瞳品牌助手Agent集群，帮您获取公司品牌/产品的最新讯息，帮您分析、洞察品牌动态，规避品牌风险、助力商业决策\n 您可以试着问我：',
        status: 'complete',
        type: 'text',
      },
      {
        data: [
          {
            prompt: '数据中心里面一共有多少条品牌视频？',
            title: '数据中心里面一共有多少条品牌视频？',
          },
          {
            prompt: '品牌视频里面关于赛力斯统计情绪为正面的数据有多少条？',
            title: '品牌视频里面关于赛力斯统计情绪为正面的数据有多少条？',
          },
        ],
        status: 'complete',
        type: 'suggestion',
      },
    ],
    id: '0',
    role: 'assistant',
  },
])
const messageList = ref<ChatMessagesData[]>(defaultMessages)

// 消息变更处理
function handleMessageChange(e: CustomEvent<ChatMessagesData[]>): void {
  messageList.value = e.detail
}

function setMessageList(list: ChatMessagesData[]): void {
  chatRef.value!.setMessages(list, 'replace')
}

const { loading, send } = useRequest(
  (id: string) =>
    alovaInst.Get<Array<Record<string, any>>>(`chatHistory/history/${id}`, {
      meta: {
        useLoading: false,
      },
    }),
  {
    immediate: false,
    initialData: [],
  },
)
let currentGeneratedSessionId = ''

watch(sessionId, async (id) => {
  if (id === '') {
    setMessageList(defaultMessages)
  } else {
    if (id === currentGeneratedSessionId) {
      return
    }

    currentGeneratedSessionId = ''

    const result = await send(id)

    setMessageList(
      result.map((item) => {
        if (item.messageType === 'assistant') {
          return {
            content: [
              {
                data: item.content,
                type: 'markdown',
              },
            ],
            id: item.id,
            role: 'assistant',
            status: 'complete',
          }
        } else {
          return {
            content: [
              {
                data: item.content,
                type: 'text',
              },
            ],
            id: item.id,
            role: 'user',
            status: 'complete',
          }
        }
      }),
    )
  }
})

// 消息属性配置
const messageProps: TdChatMessageConfig = reactive({
  assistant: {
    animation: 'dots',
    avatar: robotOutlineUrl,
    handleActions: {
      suggestion: ({ content }: any) => {
        chatRef.value?.addPrompt(content.prompt)
      },
    },
    placement: 'left',
    variant: 'outline',
  },
  user: {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    placement: 'right',
    variant: 'base',
  },
})
const senderProps = computed(() => ({
  placeholder: '请输入内容，如:分析塞力斯公司、产品的现状',
}))
const reportMsg = ref('')
const reportTheme = ref<'error' | 'loading' | 'success'>('loading')
// 聊天服务配置
const chatServiceConfig: ChatServiceConfig = {
  // 对话服务地址
  endpoint: `${location.origin}/yq-ai/agent/call`,
  // 流式对话过程中用户主动结束对话业务自定义行为
  onAbort: async () => {},
  onComplete: () => {
    reportMsg.value = ''
    reportTheme.value = 'loading'
  },
  // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
  // onComplete: (aborted, params) => {
  //   console.log('onComplete', aborted, params)
  // },
  // 流式对话过程中出错业务自定义行为
  onError: (err: any) => {
    $notify.error(err.message ?? 'ai对话返回错误')
  },
  // 自定义流式数据结构解析
  onMessage: (chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null => {
    const { data, event } = chunk

    switch (event) {
      // 正文
      case '':
      case 'message':
        return {
          data,
          type: 'markdown',
        }
      case 'report_complete':
        reportMsg.value = '报告生成完成'
        reportTheme.value = 'success'
        return null
      case 'report_error':
        reportMsg.value = '报告生成失败'
        reportTheme.value = 'error'
        return null
      case 'report_step':
        reportMsg.value = data.message
        reportTheme.value = 'loading'
        return null
      case 'session_created':
        currentGeneratedSessionId = data
        sessionId.value = data
        return null
      default:
        return { data, type: 'text' }
    }
  },

  // 自定义请求参数
  onRequest: (innerParams: any) => {
    const { prompt } = innerParams

    return {
      body: JSON.stringify({
        question: prompt,
        sessionId: sessionId.value,
      }),
      headers: {
        Authorization: useLoginStore().token,
      },
    }
  },
  stream: true,
}

function handleRegenerate(): void {
  chatRef.value?.regenerate()
}

const { copy } = useClipboard({
  legacy: true,
})

async function handleCopy(data: any): Promise<void> {
  await copy(getMessageContentForCopy(data))
  $msg('复制成功')
}

defineExpose({
  setMessageList,
})
</script>

<template>
  <div v-loading="loading" class="chatbot_wrapper h-full overflow-y-auto bg-[#fff] p-4">
    <Teleport v-if="reportMsg !== ''" to="#app">
      <TMessage
        class="absolute! top-[50%] left-[50%] z-[calc(Infinity)] translate-x-[-50%] translate-y-[-50%]"
        :theme="reportTheme"
        :duration="0"
        >{{ reportMsg }}</TMessage
      >
    </Teleport>
    <TChatbot
      ref="chatRef"
      :default-messages="defaultMessages"
      :message-props="messageProps"
      :sender-props="senderProps"
      :chat-service-config="chatServiceConfig"
      @message-change="handleMessageChange"
    >
      <!-- 自定义消息操作区 -->
      <template v-for="(data, index) in messageList" :key="`${data.id}-actionbar`">
        <template v-if="data.role === 'assistant'">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <div :slot="`${data.id}-actionbar`">
            <div v-if="data.status === 'complete'">
              <TSpace size="small">
                <TButton
                  v-if="index === messageList.length - 1"
                  shape="square"
                  theme="default"
                  variant="base"
                  size="small"
                  @click="handleRegenerate"
                >
                  <template #icon>
                    <Icon icon="mdi-refresh" size="24"></Icon>
                  </template>
                </TButton>
                <TButton
                  shape="square"
                  theme="default"
                  variant="base"
                  size="small"
                  @click="handleCopy(data)"
                >
                  <template #icon>
                    <Icon icon="mdi-content-copy" size="18"></Icon>
                  </template>
                </TButton>
              </TSpace>
            </div>
          </div>
        </template>
      </template>
    </TChatbot>
  </div>
</template>
