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
// 计算哪些表单项需要展开/折叠 ------- start -------
const showExtraFormItems = ref(false)
const showToggleBtn = ref(false)
let formDom: HTMLFormElement | null = null

useResizeObserver(formInstance, (entries) => {
  formDom = (entries[0]?.target ?? null) as HTMLFormElement | null
  calcFormItemToggle()
})

function calcFormItemToggle(): void {
  nextTick(() => {
    if (formDom === null) {
      return
    }

    const formItemsDomList: HTMLDivElement[] = Array.from(
      formDom.querySelectorAll('.t-form__item') as NodeListOf<HTMLDivElement>, // display: none 的 offsetTop 为 0
    )

    formItemsDomList.forEach((item) => {
      item.style.display = getComputedStyle(formItemsDomList[0]!).display
    })

    const co = _.groupBy(formItemsDomList, (item) => {
      return item.offsetTop
    })
    const keys = Object.keys(co).sort((a, b) => Number(a) - Number(b))

    showToggleBtn.value =
      keys.length > 3 ||
      (keys.length === 3 &&
        Number(keys[keys.length - 1]) - Number(keys[keys.length - 2]) >
          Number(keys[1]) - Number(keys[0]))

    if (!showExtraFormItems.value) {
      keys.slice(2, -1).forEach((key) => {
        const items = co[key]

        items!.forEach((item) => {
          item.style.display = 'none'
        })
      })

      if (keys.length > 2 && showToggleBtn.value) {
        co[keys[1]!]![co[keys[1]!]!.length - 1]!.style.display = 'none'
      }
    }
  })
}

watch([showExtraFormItems, () => formItems.value.length], calcFormItemToggle)
// 计算哪些表单项需要展开/折叠 ------- end -------

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
      <TButton
        v-if="showToggleBtn"
        variant="outline"
        @click="showExtraFormItems = !showExtraFormItems"
      >
        展开
        <template #icon>
          <Icon :icon="showExtraFormItems ? 'ep:arrow-up' : 'ep:arrow-down'"></Icon>
        </template>
      </TButton>
    </template>
  </TForm>
</template>
