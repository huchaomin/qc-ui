<script setup lang="ts">
import Chatbot from './modules/home/Chatbot.vue'
import ChatHistory from './modules/home/ChatHistory.vue'

const { loading, onSuccess, send } = useRequest(
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

function handleChange(id: null | string) {
  if (id === null) {
  } else {
    send(id)
  }
}

const chatbotRef = useTemplateRef('chatbotRef')

onSuccess(({ data }) => {
  chatbotRef.value!.setMessageList(
    data.map((item) => {
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
})
</script>

<template>
  <div class="grid h-full grid-cols-[300px_1fr]">
    <ChatHistory @change="handleChange"></ChatHistory>
    <Chatbot ref="chatbotRef" v-loading="loading"></Chatbot>
  </div>
</template>
