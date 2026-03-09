<script setup lang="ts">
import NegativeCommentList from './NegativeCommentList.vue'
import Top5Comment from './Top5Comment.vue'

const props = withDefaults(
  defineProps<{
    data: Record<string, any>
  }>(),
  {},
)
const commentViewpointStr = computed(() => {
  const obj = props.data.commentViewpointMap ?? {}

  return Object.keys(obj)
    .map((key) => {
      return `${key}(${obj[key]}%)`
    })
    .join(',')
})

provide(
  'analysisResult',
  computed(() => props.data),
)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px">
    <div>
      <label>负面评论数：</label>
      {{ data.negativeCommentNum }}/{{ data.commentCount }}
    </div>
    <div style="grid-column: span 2">
      <label>评论关键词：</label>
      {{ data.commentCoreWords }}
    </div>
    <div style="grid-column: span 3">
      <label>评论观点分类：</label>
      {{ commentViewpointStr }}
    </div>
  </div>
  <div class="mt-4 grid grid-cols-2 gap-4">
    <Top5Comment></Top5Comment>
    <NegativeCommentList></NegativeCommentList>
  </div>
</template>

<style scoped>
label {
  color: #999;
}
</style>
