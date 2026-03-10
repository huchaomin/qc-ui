<script setup lang="ts">
import DOMPurify from 'dompurify'

withDefaults(
  defineProps<{
    data: Record<string, any>
  }>(),
  {},
)
</script>

<template>
  <TCard title="内容详情">
    <template #actions>
      <TLink v-if="data.originalUrl" v-copy="data.originalUrl" class="mr-4!"> 复制原链接 </TLink>
    </template>
    <div
      class="mx-auto max-w-[600px]"
      v-html="DOMPurify.sanitize(data.contentText, { USE_PROFILES: { html: true } })"
    ></div>
  </TCard>
</template>
