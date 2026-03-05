<script setup lang="ts">
const formData = inject<Record<string, any>>('formData')!
const wordsTypeLabel = computed(() => {
  return useDicLabel('words_type', formData.wordsType).value
})
const { loading, onSuccess, send } = useRequest(
  (brandId) =>
    alovaInst.Post<{
      data: string
    }>(
      'yq-ai/openai/chat-model/brandChat',
      {
        agentType: 6,
        brandId,
        content: `搜索类型：${wordsTypeLabel.value}，基础词：${formData.monitorWord}`,
      },
      {
        meta: {
          useLoading: false,
          useResponseText: true,
        },
      },
    ),
  {
    immediate: false,
    initialData: '',
  },
)

onSuccess(({ data }) => {
  formData.monitorWord = data
})

const monitorWordInputProps = computed(() => {
  const placeholderMap: Record<string, string> = {
    '0': '请输入监控词,多个以英文逗号分割',
    '1': '"()"表示分组，"|"表示或，"+"表示且',
    '2': '请搜索作者',
  }

  return {
    disabled: formData.wordsType === '2' || loading.value,
    maxlength: 500,
    onBlur: () => {
      if (formData.wordsType === '0') {
        formData.monitorWord = formData.monitorWord.replace(/，/g, ',')
      } else if (formData.wordsType === '1') {
        formData.monitorWord = formData.monitorWord
          .trim()
          .replace(/\s+/g, '')
          .replace(/（/g, '(')
          .replace(/）/g, ')')
      }
    },
    placeholder: placeholderMap[formData.wordsType],
  }
})
const brandOptions = useList('brand')

function handleGenerateMonitorWord(): void {
  if (isFalsy(formData.monitorWord)) {
    $msg.error('请输入基础词组')
    return
  }

  if (brandOptions.value.length === 0) {
    $msg.error('请先添加品牌，再进行AI拓展')
    return
  }

  if (brandOptions.value.length > 1) {
    const formRef = ref<FormInstance | null>(null)

    $confirm({
      body: () =>
        h(resolveComponent('TForm') as Component<FormProps>, {
          data: reactive({
            brandId: brandOptions.value[0]!.value,
          }),
          items: [
            {
              _required: true,
              component: 'TRadioGroup',
              model: 'brandId',
              options: 'brand',
              style: 'max-width: 800px;',
            },
          ],
          layout: 'vertical',
          ref: formRef,
        }),
      header: '请选择品牌',
      onConfirmCallback: async () => {
        const { brandId } = await formRef.value!.validate()

        send(brandId)
      },
    })
    return
  }

  send(brandOptions.value[0]!.value)
}
</script>

<template>
  <TTooltip
    v-if="['0', '1'].includes(formData.wordsType)"
    content="该功能智能体与品牌绑定，需使用单一品牌账号进行拓展"
    theme="light"
  >
    <TButton
      style="position: absolute; top: -27px; right: 0"
      size="small"
      theme="default"
      :loading="loading"
      @click="handleGenerateMonitorWord"
    >
      AI拓展
    </TButton>
  </TTooltip>
  <TTextarea v-model="formData.monitorWord" v-bind="monitorWordInputProps"></TTextarea>
</template>
