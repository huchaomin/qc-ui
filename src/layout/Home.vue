<script setup lang="ts">
import Chatbot from './modules/home/Chatbot.vue'
import ChatHistory from './modules/home/ChatHistory.vue'

const sessionId = ref<string>('')
</script>

<template>
  <div class="grid h-full grid-cols-[300px_1fr]">
    <ChatHistory v-model:session-id="sessionId"></ChatHistory>
    <Chatbot v-model:session-id="sessionId"></Chatbot>
  </div>
</template>
