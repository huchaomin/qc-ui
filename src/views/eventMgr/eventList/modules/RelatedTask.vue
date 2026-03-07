<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fillAll?: boolean
  }>(),
  {
    fillAll: false,
  },
)
const formData = inject<Record<string, any>>('formData')!
const options = computed(() => {
  return [
    ...useList('task').value,
    ...useList('follow').value.map((item) => {
      return {
        ...item,
        value: `${item.value}_follow`,
      }
    }),
  ].map((item) => {
    return {
      ...item,
      content: () =>
        h(
          'div',
          {
            class: 'flex items-center justify-between',
          },
          [
            h('span', item.label),
            h(
              'span',
              {
                class: 'text-[var(--td-font-gray-3)] text-xs',
              },
              item.value.endsWith('_follow') ? '关注组' : '任务',
            ),
          ],
        ),
    }
  })
})

watchEffect(() => {
  if (props.fillAll) {
    formData.relatedTask = options.value.map((item) => item.value)
  }
})
</script>

<template>
  <TSelect
    v-model="formData.relatedTask"
    multiple
    :min-collapsed-num="0"
    :options="options"
  ></TSelect>
</template>
