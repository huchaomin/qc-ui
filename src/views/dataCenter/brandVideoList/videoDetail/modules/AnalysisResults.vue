<script setup lang="ts">
import ContentSlice from './ContentSlice.vue'
import MoodAnalysisAndContentSummarize from './MoodAnalysisAndContentSummarize.vue'

const data = inject<Ref<Record<string, any> | undefined>>('data')!
</script>

<template>
  <div>
    <MoodAnalysisAndContentSummarize :analysis-result="data"></MoodAnalysisAndContentSummarize>
    <ContentSlice v-if="data !== undefined" :data="data"></ContentSlice>
  </div>
</template>
