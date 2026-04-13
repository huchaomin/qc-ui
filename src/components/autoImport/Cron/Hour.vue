<script lang="ts" setup>
import Common from './Common.vue'

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <Common v-model="modelValue" :select-length="24" unit="时"></Common>
</template>
