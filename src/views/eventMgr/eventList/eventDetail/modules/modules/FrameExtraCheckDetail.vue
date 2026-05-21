<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    result: Record<string, any>
  }>(),
  {},
)
</script>

<template>
  <TDescriptions>
    <TDescriptionsItem label="所需总积分">{{ result.needPoints }}</TDescriptionsItem>
    <TDescriptionsItem label="总抽帧数">{{ result.totalExtraNum }}</TDescriptionsItem>
  </TDescriptions>
</template>
