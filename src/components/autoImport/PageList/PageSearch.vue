<script setup lang="ts">
import type { FormPropsType } from '@/components/tDesignReset/TForm.vue'

const props = withDefaults(defineProps<FormPropsType>(), {})
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
  const obj: Partial<FormPropsType> = {
    ...props,
  }

  delete obj.items
  delete obj.data
  return obj
})
const formInstance = useTemplateRef('formRef')

function handleReset() {
  formData.value = _.cloneDeep(props.data)
}

async function handleSearch() {
  await formInstance.value!.validate()
}
</script>

<template>
  <TForm ref="formRef" :data="formData" :items="formItems" v-bind="otherProps">
    <template #btn>
      <TButton @click="handleSearch">查询</TButton>
      <TButton theme="default" @click="handleReset">重置</TButton>
    </template>
  </TForm>
</template>
