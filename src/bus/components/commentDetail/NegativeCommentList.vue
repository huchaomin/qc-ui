<script setup lang="ts">
import type { TdListProps } from 'tdesign-vue-next'
import CommentList from './CommentList.vue'

const analysisResult = inject<Ref<Record<string, any>>>('analysisResult')!
const {
  data: list,
  isLastPage, // 是否最后一页 初始值为 true, 数据还没加载过来它就已经变为true了
  loading, // 是否正在加载数据 初始值为 true
  page: pageNum,
} = usePagination(
  (pageNum, pageSize) => {
    return alovaInst.Get<{
      data: Array<Record<string, any>>
      total: number
    }>('data/brandCommentInfo/list', {
      meta: {
        useLoading: false,
      },
      params: {
        brandId: analysisResult.value!.brandId,
        contentId: analysisResult.value!.contentId,
        moodLevel: -1,
        orderByColumn: 'like_count',
        pageNum,
        pageSize,
      },
      transform: (data: any) => {
        return {
          data: data.rows,
          total: data.total,
        }
      },
    })
  },
  {
    append: true, // 是否追加数据，默认为false
    initialData: {
      data: [],
      total: 0,
    },
    initialPage: 1, // 初始页码，默认为1
    initialPageSize: 10, // 初始每页数据条数，默认为10
  },
)
const disabled = computed(() => {
  return loading.value || isLastPage.value
})
const scrollHandler: TdListProps['onScroll'] = (e) => {
  const { scrollBottom } = e

  if (!disabled.value && scrollBottom < 10) {
    pageNum.value++
  }
}
</script>

<template>
  <TCard title="负面评论" :shadow="false" :header-bordered="false" class="bg-[#fafafa]!">
    <TList
      :async-loading="isLastPage ? '没有更多数据了' : loading ? '正在加载中，请稍等...' : ''"
      split
      style="max-height: 520px"
      @scroll="scrollHandler"
    >
      <CommentList :list="list"></CommentList>
    </TList>
  </TCard>
</template>
