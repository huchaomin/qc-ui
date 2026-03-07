<script setup lang="ts">
import { addEventStrategy } from '../../eventStrategy/index.vue'

const formData = inject<Record<string, any>>('formData')!

function handleAdd() {
  addEventStrategy()
}
</script>

<template>
  <div class="flex w-full items-center">
    <TSelect v-model="formData.eventRule" options="eventRule"></TSelect>
    <TButton class="ml-2!" permission="yq:eventRule:add" theme="default" @click="handleAdd"
      >新增</TButton
    >
  </div>
</template>
