<script setup lang="ts">
import CommentList from './CommentList.vue'

const analysisResult = inject<Ref<Record<string, any>>>('analysisResult')!
const { data } = useRequest(
  alovaInst.Get<{
    rows: Array<Record<string, any>>
    total: number
  }>('data/brandCommentInfo/list', {
    meta: {
      useLoading: false,
    },
    params: {
      brandId: analysisResult.value!.brandId,
      contentId: analysisResult.value!.contentId,
      orderByColumn: 'like_count',
      pageSize: 5,
    },
  }),
  {
    initialData: {},
  },
)
const list = computed(() => {
  return data.value.rows ?? []
})
</script>

<template>
  <TCard title="热度Top5评论" :shadow="false" :header-bordered="false" class="bg-[#fafafa]!">
    <TList split style="max-height: 520px">
      <CommentList :list="list"></CommentList>
    </TList>
  </TCard>
</template>
