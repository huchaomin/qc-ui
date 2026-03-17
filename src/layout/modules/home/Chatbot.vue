<script setup lang="ts">
import type {
  ChatMessagesData,
  ChatServiceConfig,
  TdChatbotApi,
  TdChatMessageConfig,
} from '@tdesign-vue-next/chat'
import { getMessageContentForCopy, Chatbot as TChatbot } from '@tdesign-vue-next/chat'
import robotOutlineUrl from 'img/robot-outline.svg?url'

const chatRef = ref<null | TdChatbotApi>(null)
// 默认初始化消息
const defaultMessages: ChatMessagesData[] = markRaw([
  {
    content: [
      {
        data: '欢迎使用炽瞳助手，你可以这样问我：',
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
    id: '123',
    role: 'assistant',
  },
])
const mockMessage = ref<ChatMessagesData[]>(defaultMessages)

// 消息变更处理
function handleMessageChange(e: CustomEvent<ChatMessagesData[]>): void {
  mockMessage.value = e.detail
}

// 消息属性配置
const messageProps: TdChatMessageConfig = reactive({
  assistant: {
    avatar: robotOutlineUrl,
    handleActions: {
      suggestion: ({ content }: any) => {
        console.log('点击建议问题', content)
        chatRef.value?.addPrompt(content.prompt)
      },
    },
    placement: 'left',
  },
  user: {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    placement: 'right',
    variant: 'base',
  },
})
const senderProps = computed(() => ({
  placeholder: '输入你需要咨询的问题',
}))
// 聊天服务配置
const chatServiceConfig: ChatServiceConfig = {
  // 对话服务地址
  endpoint: `${location.origin}/yq-ai/agent/call`,
  // 流式对话过程中用户主动结束对话业务自定义行为
  onAbort: async () => {},
  // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
  // onComplete: (aborted, params) => {
  //   console.log('onComplete', aborted, params)
  // },
  // 流式对话过程中出错业务自定义行为
  onError: (err: any) => {
    $notify.error(err.message ?? 'ai对话返回错误')
  },
  // 自定义流式数据结构解析
  onMessage: (chunk: any): any => {
    const { data, event } = chunk

    switch (event) {
      // 完成
      case 'complete':
        return {
          data: '',
          status: 'complete',
        }
      // 正文
      case 'message':
        return {
          data: data || '',
          type: 'markdown',
        }
      case 'session_created':
        return
      default:
        return { data: data || '', type: 'text' }
    }
  },
  // 自定义请求参数
  onRequest: (innerParams: any) => {
    const { prompt } = innerParams

    return {
      body: JSON.stringify({
        question: prompt,
      }),
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
</script>

<template>
  <div class="chatbot_wrapper h-full bg-[#fff] p-4">
    <TChatbot
      ref="chatRef"
      :default-messages="defaultMessages"
      :message-props="messageProps"
      :sender-props="senderProps"
      :chat-service-config="chatServiceConfig"
      @message-change="handleMessageChange"
    >
      <!-- 自定义消息操作区 -->
      <template v-for="(data, index) in mockMessage" :key="`${data.id}-actionbar`">
        <template v-if="data.role === 'assistant'">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <div :slot="`${data.id}-actionbar`">
            <div v-if="data.status === 'complete'">
              <TSpace size="small">
                <TButton
                  v-if="index === mockMessage.length - 1"
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
