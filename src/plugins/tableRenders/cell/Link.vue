<script setup lang="ts">
import type { LinkProps as _LinkProps } from '@/components/tDesignReset/TLink.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { linkPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LinkProps>(), {
  ...linkPropsInit,
})

export type LinkProps = _LinkProps

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <TLink v-bind="props">
    {{ attrs.row[attrs.col.colKey] }}
  </TLink>
</template>
