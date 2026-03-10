<script setup lang="ts">
import { showAiHandlingSuggestions as _showAiHandlingSuggestions } from '@/bus'
import AnalysisResults from './modules/AnalysisResults.vue'

const route = useRoute()
const id = route.query.id as string
const { data } = useRequest(
  () => alovaInst.Get<Record<string, any> | undefined>(`data/brandContentInfo/${id}`),
  {
    initialData: undefined,
  },
)
const tabs = [
  {
    component: markRaw(AnalysisResults),
    label: '分析结果',
    value: 'analysisResults',
  },
]
const tab = ref(tabs[0]!.value)

provide('data', data)

function showAiHandlingSuggestions(): void {
  _showAiHandlingSuggestions({
    ...data.value!,
    contentId: data.value!.textId,
  })
}
</script>

<template>
  <div>
    <TCard v-if="data" :title="`标题：${data.title || '无标题'}`">
      <template #actions>
        <TButton theme="default" class="ml-4!" @click="showAiHandlingSuggestions">
          AI处理建议生成
        </TButton>
      </template>
      <div class="detail">
        <span>
          <label>内容来源：</label>
          {{ data.platform }}
        </span>
        <span>
          <label>作者：</label>
          {{ data.authorName }}
        </span>
        <span>
          <label>转发数：</label>
          {{ data.forwardCount }}
        </span>
        <span>
          <label>评论数：</label>
          {{ data.commentCount }}
        </span>
        <span>
          <label>发布时间：</label>
          {{ data.publishTime }}
        </span>
      </div>
      <div class="content">
        <span>
          <label>内容标签：</label>
          {{ data.contentLabel || '--' }}
        </span>
        <span class="ml-auto shrink-0">
          <label>创建时间：</label>
          {{ data.createTime }}
        </span>
      </div>
    </TCard>
    <TCard class="mt-4!">
      <TTabs v-model="tab" size="large" class="-mt-4!">
        <TTabPanel v-for="item in tabs" :key="item.value" :value="item.value" :label="item.label">
          <Component :is="item.component" class="mt-4!"></Component>
        </TTabPanel>
      </TTabs>
    </TCard>
  </div>
</template>

<style scoped>
label {
  @apply text-(--td-text-color-placeholder);
}

.detail {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;

  > * {
    white-space: nowrap;
  }
}

.content {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
</style>
