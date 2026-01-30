<script setup lang="ts">
import type { LinkProps as _LinkProps } from '@/components/tDesignReset/TLink.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { linkPropsInit } from '@/components/tDesignReset/utils'
import _ from '@/plugins/autoImport/_.ts'
import { cellRenderContextKeys } from './index'

const props = withDefaults(defineProps<CellRenderContext & LinkProps>(), {
  ...linkPropsInit,
})

export type LinkProps = _LinkProps
</script>

<template>
  <TLink v-bind="_.omit(props, cellRenderContextKeys)">
    {{ props.row[props.col.colKey] }}
  </TLink>
</template>
