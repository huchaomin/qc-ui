<script setup lang="ts">
import type { DropdownOption, TdListProps } from 'tdesign-vue-next'
import autoAnimate from '@formkit/auto-animate'
import robotOutlineUrl from 'img/robot-outline.svg?url'

const {
  data: _data,
  isLastPage, // 是否最后一页 初始值为 true, 数据还没加载过来它就已经变为true了
  loading, // 是否正在加载数据 初始值为 true
  page: pageNum,
  refresh,
} = usePagination(
  (pageNum, pageSize) => {
    return alovaInst.Post<{
      data: Array<Record<string, any>>
      total: number
    }>(
      'chatHistory/sessions',
      {
        pageNum,
        pageSize,
      },
      {
        meta: {
          useLoading: false,
        },
      },
    )
  },
  {
    append: true, // 是否追加数据，默认为false
    data: (data: any) => data.rows,
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
const asyncLoading = computed(() => {
  return loading.value ? '正在加载中，请稍等...' : isLastPage.value ? '没有更多数据了' : ''
})
const scrollHandler: TdListProps['onScroll'] = (e) => {
  const { scrollBottom } = e

  if (!disabled.value && scrollBottom < 5) {
    pageNum.value++
  }
}
const data = computed(() => {
  const co = _groupBy(_data.value, (item) => {
    if (dayjs(item.updateTime).isSame(dayjs(), 'day')) {
      return '今天'
    }

    if (dayjs(item.updateTime).isSame(dayjs().subtract(1, 'day'), 'day')) {
      return '昨天'
    }

    if (dayjs(item.updateTime).isAfter(dayjs().subtract(7, 'day'))) {
      return '过去7天'
    }

    if (dayjs(item.updateTime).isAfter(dayjs().subtract(30, 'day'))) {
      return '过去30天'
    }

    return '更久之前'
  })

  Object.values(co).forEach((arr) => {
    arr.sort((a, b) => (dayjs(b.updateTime).isAfter(dayjs(a.updateTime)) ? 1 : -1))
  })

  const arr: Record<string, any>[] = []

  Object.keys(co).forEach((key) => {
    arr.push({
      id: key,
      isGroupTitle: true,
      sessionTitle: key,
    })
    arr.push(...co[key])
  })
  return arr
})

async function clickHandler(e: DropdownOption, item: Record<string, any>) {
  if (e.value === 'delete') {
    await $confirm('确定删除对话记录吗？')
    await alovaInst.Delete(`chatHistory/session/${item.sessionId}`)
    void $msg('删除成功')

    for (let index = 1; index <= pageNum.value; index++) {
      await refresh(index)
    }
  }
}

const listRef = useTemplateRef('listRef')

watch(listRef, (val) => {
  if (val) {
    autoAnimate(listRef.value!.$el.querySelector('.t-list__inner'))
  }
})
</script>

<template>
  <div class="flex flex-col overflow-y-auto bg-[#F4F7FE]">
    <div class="px-4">
      <div class="mt-8 mb-4 flex items-center justify-center">
        <TAvatar :image="robotOutlineUrl"></TAvatar>
        <TTypographyTitle level="h4" class="my-0! ml-3!">炽瞳品牌助手Agent</TTypographyTitle>
      </div>
      <TTypographyTitle level="h6" class="mb-4! text-center text-(--td-text-color-placeholder)!"
        >这里暂时留出来，需要一句产品的Slogan</TTypographyTitle
      >
      <TButton block variant="outline" shape="round" theme="primary" size="large">
        <template #icon>
          <Icon icon="line-md:plus"></Icon>
        </template>
        开启新对话
      </TButton>
    </div>
    <div class="flex flex-1 flex-col justify-center overflow-y-auto">
      <TList
        v-if="_data.length > 0"
        ref="listRef"
        :async-loading="asyncLoading"
        class="mb-2! flex flex-1 flex-col bg-transparent!"
        size="small"
        @scroll="scrollHandler"
      >
        <template v-for="i in data" :key="i.id">
          <div
            v-if="i.isGroupTitle"
            class="sticky top-0 z-1 bg-[#F4F7FE] px-4 pt-4 pb-1 text-xs text-(--td-text-color-placeholder)"
          >
            {{ i.sessionTitle }}
          </div>
          <TListItem
            v-else
            tabindex="0"
            :class="{
              active: i.active,
            }"
          >
            <TTypographyText ellipsis class="my-0!">
              {{ i.sessionTitle }}
            </TTypographyText>
            <template #action>
              <TDropdown
                trigger="click"
                :options="[{ content: '删除', value: 'delete' }]"
                :popup-props="{
                  onVisibleChange: (visible) => {
                    i.active = visible
                  },
                }"
                @click="(e) => clickHandler(e, i)"
              >
                <TButton shape="circle" variant="text">
                  <Icon icon="tabler:dots-filled"></Icon>
                </TButton>
              </TDropdown>
            </template>
          </TListItem>
        </template>
        <template v-if="asyncLoading === ''" #footer>
          <div class="flex justify-center py-2">
            <TLink
              hover="color"
              size="small"
              theme="default"
              class="text-(--td-text-color-placeholder)!"
              @click="pageNum++"
            >
              点击加载更多
            </TLink>
          </div>
        </template>
      </TList>
      <TEmpty v-else title="暂无对话记录"></TEmpty>
    </div>
  </div>
</template>

<style scoped>
.t-list-item {
  min-height: 40px;
  padding: 0 12px !important;
  margin: 0 4px;
  cursor: pointer;
  border-radius: calc(infinity * 1px);
  transition: all 0.5s ease;

  :deep() {
    .t-list-item__action {
      display: none;
    }
  }

  &:hover,
  &.active {
    background-color: var(--td-gray-color-4);

    :deep() {
      .t-list-item__action {
        display: list-item;
      }
    }
  }
}
</style>
