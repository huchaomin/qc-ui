<script setup lang="ts">
const formData = inject<Record<string, any>>('formData')!
const nameOptions = useList('name') // 白1，黑2
const nameType = computed(() => {
  return nameOptions.value.find((item) => item.value === formData.listId)?.type
})
const min = computed(() => {
  if (isFalsy(nameType.value)) {
    return undefined
  }

  return nameType.value === 1 ? 1 : 0
})
const max = computed(() => {
  if (isFalsy(nameType.value)) {
    return undefined
  }

  return nameType.value === 1 ? 2 : 1
})
</script>

<template>
  <TInputNumber v-model="formData.weight" :decimal-places="1" :min="min" :max="max"></TInputNumber>
</template>
