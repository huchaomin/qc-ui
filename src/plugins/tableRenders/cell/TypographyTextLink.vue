<script setup lang="ts">
import type { TdTextProps as _TdTextProps } from 'tdesign-vue-next'
import type { LinkProps as _LinkProps } from '@/components/tDesignReset/TLink.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { linkPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})
withDefaults(defineProps<TypographyTextLinkProps>(), {
  link: () => ({}),
  typographyText: () => ({}),
})

export interface TypographyTextLinkProps {
  link?: _LinkProps
  typographyText?: _TdTextProps
}

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <TTypographyText
    v-bind="{
      ...typographyText,
      copyable:
        typographyText.copyable === true || typographyText.copyable === undefined
          ? {
              text: _get(attrs.row, attrs.col.colKey),
            }
          : typographyText.copyable,
    }"
  >
    <TLink
      v-bind="{
        ...linkPropsInit,
        ...link,
      }"
    >
      {{ _get(attrs.row, attrs.col.colKey) }}
    </TLink>
  </TTypographyText>
</template>
