<script lang="ts" setup>
import type { SelectInputProps } from 'tdesign-vue-next'
import Icon from '@/components/autoImport/Icon.vue'
import TButton from '@/components/tDesignReset/TButton.vue'

const props = withDefaults(
  defineProps<{
    defaultInputValue?: string
  }>(),
  {
    defaultInputValue: '',
  },
)
const emit = defineEmits<{
  change: [value: ListItem | null, formData: Record<string, any>]
}>()

interface ListItem {
  id: null | string
  label: string
  value: string
}

const formData = inject<Record<string, any>>('formData')!
const inputValue = ref(props.defaultInputValue)
const selectValue = ref<ListItem | undefined>()
const popupVisible = ref(false)
const options = ref<ListItem[]>([])
const { loading, onError, onSuccess, send } = useRequest(
  (data: Record<string, any>) =>
    alovaInst.Get<Array<Record<string, any>>>('yq/author/getAuthorList', {
      meta: {
        useLoading: false,
      },
      params: data,
    }),
  {
    immediate: false,
    initialData: [],
  },
)

onError(() => {
  options.value = []
})
onSuccess(({ data }) => {
  options.value = data.map((item) => {
    return {
      id: item.id,
      label: item.nickName,
      value: item.authorName,
    }
  })
})

// const onClear: SelectInputProps['onClear'] = () => {
//   selectValue.value = undefined
//   inputValue.value = ''
//   options.value = []
// }
function onEnter() {
  if (loading.value) {
    return
  }

  if (inputValue.value.trim() === '') {
    $msg.error('请输入作者名称')
    return
  }

  popupVisible.value = true
  send({
    authorName: inputValue.value,
  })
}

function onOptionClick(item: ListItem) {
  selectValue.value = item
  inputValue.value = item.label
  popupVisible.value = false
  emit('change', item, formData)
}

const onPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (val, context) => {
  if (context.trigger === 'trigger-element-click' && options.value.length === 0) {
    return
  }

  popupVisible.value = val
}
/**
 * @description: onOptionClick 不会触发 input-change 事件
 */
const onInputChange: SelectInputProps['onInputChange'] = (val) => {
  inputValue.value = val
  selectValue.value = undefined
  popupVisible.value = false
  options.value = []
  emit('change', null, formData)
}

function append() {
  return h(
    TButton,
    {
      class: 'ml-1!',
      onClick: () => {
        onEnter()
      },
      shape: 'square',
    },
    {
      default: () =>
        h(Icon, {
          icon: 'line-md:search',
        }),
    },
  )
}
</script>

<template>
  <TInputAdornment :append="append">
    <TSelectInput
      :value="inputValue"
      :input-value="inputValue"
      :popup-visible="popupVisible && !loading && options.length > 0"
      :popup-props="{
        overlayClassName: 't-select__dropdown',
      }"
      allow-input
      placeholder="按搜索按钮或回车键完成搜索"
      @enter="onEnter"
      @popup-visible-change="onPopupVisibleChange"
      @input-change="onInputChange"
    >
      <template #panel>
        <div class="t-select__dropdown-inner t-select__dropdown-inner--size-m">
          <ul class="t-select__list">
            <li
              v-for="item in options"
              :key="item.value"
              class="t-select-option t-size-m"
              @click="() => onOptionClick(item)"
            >
              <span>
                {{ item.label }}
              </span>
            </li>
          </ul>
        </div>
      </template>
      <template #suffixIcon>
        <Icon
          :icon="loading ? 'line-md:loading-twotone-loop' : 'tdesign:chevron-down'"
          size="16"
          class="text-(--td-text-color-placeholder)"
        />
      </template>
    </TSelectInput>
  </TInputAdornment>
</template>
