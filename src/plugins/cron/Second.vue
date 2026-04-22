<script lang="ts" setup>
import Common from './Common.vue'

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <Common v-model="modelValue" :select-length="60" unit="秒"></Common>
</template>
