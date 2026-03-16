<script setup lang="ts">
import type { FormProps } from '@/components/tDesignReset/TForm.vue'
import { mergeProps } from 'vue'
import { formPropsInit } from '@/components/tDesignReset/TForm.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormProps>(), formPropsInit)
const emit = defineEmits<{
  query: [formData: Record<string, any>]
  reset: [formData: Record<string, any>]
}>()
const formData = ref(_cloneDeep(props.data))

watch(
  () => props.data,
  (newVal) => {
    Object.assign(formData.value, _cloneDeep(newVal))
  },
  {
    deep: true,
  },
)

const formItems = computed(() => {
  return [
    ...props.items,
    {
      slot: '_btn',
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
const formRef = useTemplateRef('formRef')
// 计算哪些表单项需要展开/折叠 ------- start -------
const showExtraFormItems = ref(false)
const showToggleBtn = ref(false)
let formDom: HTMLFormElement | null = null

useResizeObserver(formRef, (entries) => {
  formDom = (entries[0]?.target ?? null) as HTMLFormElement | null
  calcFormItemToggle()
})

function calcFormItemToggle(): void {
  nextTick(() => {
    if (formDom === null) {
      return
    }

    const formItemsDomList: HTMLDivElement[] = [
      ...(formDom.querySelectorAll('.t-form__item') as NodeListOf<HTMLDivElement>),
    ]

    formItemsDomList.forEach((item) => {
      item.style.display = getComputedStyle(formItemsDomList[0]!).display
    })

    const co = _groupBy(formItemsDomList, (item) => {
      return item.offsetTop
    })
    const keys = Object.keys(co).sort((a, b) => Number(a) - Number(b))

    showToggleBtn.value =
      keys.length > 3 ||
      (keys.length === 3 &&
        Number(keys.at(-1)) - Number(keys[keys.length - 2]) > Number(keys[1]) - Number(keys[0]))

    if (!showExtraFormItems.value) {
      keys.slice(2, -1).forEach((key) => {
        const items = co[key]

        items!.forEach((item) => {
          item.style.display = 'none'
        })
      })

      if (keys.length > 2 && showToggleBtn.value) {
        co[keys[1]!]!.at(-1)!.style.display = 'none'
      }
    }
  })
}

watch([showExtraFormItems, () => formItems.value.length], calcFormItemToggle)
// 计算哪些表单项需要展开/折叠 ------- end -------

async function handleQuery() {
  emit('query', formData.value)
}

async function handleReset() {
  Object.keys(formData.value).forEach((key) => {
    if (Object.hasOwn(props.data, key)) {
      formData.value[key] = props.data[key]
      return
    }

    if (Array.isArray(formData.value[key])) {
      formData.value[key] = []
    } else {
      formData.value[key] = ''
    }
  })
  emit('reset', formData.value)
}

defineExpose({
  formData,
  query: handleQuery,
  reset: handleReset,
})
</script>

<template>
  <TForm
    ref="formRef"
    :data="formData"
    :items="formItems"
    v-bind="
      mergeProps($attrs, otherProps, {
        class: 'relative',
      })
    "
  >
    <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
      <slot :name="k" v-bind="slotScope"></slot>
    </template>
    <template #_btn>
      <TButton class="shrink" @click="handleQuery">查询</TButton>
      <TButton theme="default" class="shrink" @click="handleReset">重置</TButton>
      <TButton
        v-if="showToggleBtn"
        variant="outline"
        class="shrink"
        @click="showExtraFormItems = !showExtraFormItems"
      >
        {{ showExtraFormItems ? '收起' : '展开' }}
      </TButton>
    </template>
  </TForm>
</template>
