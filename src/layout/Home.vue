<script setup lang="ts">
import Chatbot from './modules/home/Chatbot.vue'
import ChatHistory from './modules/home/ChatHistory.vue'
</script>

<template>
  <div class="grid h-full grid-cols-[300px_1fr]">
    <ChatHistory></ChatHistory>
    <Chatbot></Chatbot>
  </div>
</template>
