<script setup lang="ts">
import type { IconProps as _IconProps } from '@/components/autoImport/Icon.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import Icon from '@/components/autoImport/Icon.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IconProps>(), {})

export type IconProps = Omit<_IconProps, 'icon'> & {
  icon?: string
}

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <Icon
    v-bind="{
      ...props,
      icon: isFalsy(props.icon) ? (_get(attrs.row, attrs.col.colKey) ?? '') : props.icon,
    }"
  />
</template>
