<script setup lang="ts">
import type { PaginationProps as _PaginationProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSizeOptions: () => [10, 20, 50, 100],
  showPageNumber: true,
  showPageSize: true,
  showPreviousAndNextBtn: true,
  totalContent: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:pageSize': [value: number]
}>()

export type PaginationProps = Omit<
  _PaginationProps,
  'current' | 'defaultCurrent' | 'defaultPageSize' | 'modelValue' | 'pageSize'
> & {
  modelValue: number
  pageSize: number
}

type OnCurrentChangeParams = Parameters<NonNullable<_PaginationProps['onCurrentChange']>>
type OnPageSizeChangeParams = Parameters<NonNullable<_PaginationProps['onPageSizeChange']>>

const otherProps = computed(() => {
  const obj: Partial<PaginationProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Pagination
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
          onCurrentChange: (...args: OnCurrentChangeParams) => {
            const value = args[0]
            if (value > 100) {
              $confirm('仅支持前100页的查看，请用查询条件筛选数据！')
              return
            }
            emit('update:modelValue', args[0])
            props.onCurrentChange?.(...args)
          },
          onPageSizeChange: (...args: OnPageSizeChangeParams) => {
            emit('update:pageSize', args[0])
            props.onPageSizeChange?.(...args)
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
.t-pagination {
  :deep() {
    .t-pagination__total {
      flex: none;
      order: 2;
    }

    .t-pagination__select {
      .t-input {
        min-width: 100px;
      }
    }
  }
}
</style>
