<script setup lang="ts">
import type { TdTextProps as _TdTextProps } from 'tdesign-vue-next'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TypographyTextProps>(), {
  copyable: true,
})

export type TypographyTextProps = _TdTextProps

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <TTypographyText
    v-bind="{
      ...props,
      copyable:
        props.copyable === true
          ? {
              text: _get(attrs.row, attrs.col.colKey),
            }
          : props.copyable,
    }"
  >
    {{ _get(attrs.row, attrs.col.colKey) }}
  </TTypographyText>
</template>

<style scoped>
.t-typography {
  :deep() {
    .t-button {
      position: absolute;
      top: 7px;
      right: 4px;
    }
  }
}
</style>

<style>
.t-table {
  td,
  th {
    &:has(.t-typography .t-button) {
      padding-right: 30px;
    }
  }
}
</style>
