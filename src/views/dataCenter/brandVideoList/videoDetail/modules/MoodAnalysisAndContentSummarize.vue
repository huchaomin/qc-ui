<script setup lang="ts">
withDefaults(
  defineProps<{
    analysisResult: Record<string, any> | undefined
  }>(),
  {},
)
</script>

<template>
  <TCard v-if="analysisResult !== undefined" title="情绪分析">
    <template v-if="analysisResult.updateTime" #actions>
      更新时间：{{ analysisResult.updateTime }}
    </template>
    <div class="mood">
      <div>
        <label>内容情绪：</label>
        <span
          :style="{
            color:
              analysisResult.moodLevel === 1
                ? 'green'
                : analysisResult.moodLevel === -1
                  ? 'red'
                  : '#409eff',
          }"
        >
          {{ useDicLabel('mood_level', analysisResult.moodLevel).value }}
        </span>
      </div>
      <div>
        <label>情绪层级：</label>
        {{ analysisResult.moodScore }}
      </div>
      <div style="grid-column: span 4">
        <label>判断原因：</label>
        {{ analysisResult.moodReason }}
      </div>
    </div>
  </TCard>
  <TCard v-if="analysisResult !== undefined" title="内容总结">
    <div>
      <label>内容核心观点：</label>
      {{ analysisResult.coreViewpoints }}
    </div>
    <div class="mt-1">
      <label>内容关键词：</label>
      {{ analysisResult.coreWord }}
    </div>
    <div class="mt-1">
      <label>内容品牌：</label>
      {{ analysisResult.brandProduct }}
    </div>
    <div class="mt-1">
      <label>作者意图分析：</label>
      {{ analysisResult.authorIntention }}
    </div>
  </TCard>
</template>

<style scoped>
label {
  @apply text-(--td-text-color-placeholder);
}

.mood {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
</style>
