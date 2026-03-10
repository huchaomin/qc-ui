<script setup lang="ts">
import ContentSlice from './ContentSlice.vue'
import MoodAnalysisAndContentSummarize from './MoodAnalysisAndContentSummarize.vue'

const data = inject<Ref<Record<string, any> | undefined>>('data')!
</script>

<template>
  <div class="mb-2 flex flex-col gap-4">
    <MoodAnalysisAndContentSummarize :analysis-result="data"></MoodAnalysisAndContentSummarize>
    <ContentSlice v-if="data !== undefined" :data="data"></ContentSlice>
  </div>
</template>
