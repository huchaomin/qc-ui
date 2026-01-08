<script setup lang="ts">
import type { FormProps } from '@/components/tDesignReset/TForm.vue'

const props = withDefaults(defineProps<FormProps>(), {})
const emit = defineEmits<{
  query: [FormData: Record<string, any>]
}>()
const formData = ref(_.cloneDeep(props.data))

watch(
  () => props.data,
  (newVal) => {
    formData.value = _.cloneDeep(newVal)
  },
  {
    deep: true,
  },
)

const formItems = computed(() => {
  return [
    ...props.items,
    {
      slot: 'btn',
    },
  ]
})
const otherProps = computed(() => {
  const obj: Partial<FormProps> = {
    ...props,
  }

  delete obj.items
  delete obj.data
  return obj
})
const formInstance = useTemplateRef('formRef')

async function handleQuery() {
  await formInstance.value!.validate()
  emit('query', formData.value)
}

async function handleReset() {
  formData.value = _.cloneDeep(props.data)
  await handleQuery()
}

defineExpose({
  formData,
  query: handleQuery,
  reset: handleReset,
})
</script>

<template>
  <TForm ref="formRef" :data="formData" :items="formItems" v-bind="otherProps">
    <template #btn>
      <TButton @click="handleQuery">查询</TButton>
      <TButton theme="default" @click="handleReset">重置</TButton>
    </template>
  </TForm>
</template>
