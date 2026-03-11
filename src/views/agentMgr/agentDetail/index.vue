<script setup lang="ts">
const route = useRoute()
const id = route.query.id as string | undefined
const brandId = route.query.brandId as string
const type = computed(() => {
  const name = route.name as string

  if (name.includes('Add')) {
    return 'add'
  }

  if (name.includes('Edit')) {
    return 'edit'
  }

  return 'view'
})
const formData = reactive<Record<string, any>>({
  setup: 'enter',
  status: '0',
  temperature: 0.1,
})
const formItems: FormItem[] = [
  {
    _label: '智能体名称',
    _required: true,
    model: 'agentName',
  },
  {
    _label: '智能体类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'agent_type',
    model: 'agentType',
  },
  {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  {
    _class: 'col-span-2',
    _label: '智能体描述',
    model: 'agentDesc',
  },
]
const { data: modelOptions, onSuccess } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/modelCfg/getList'),
  {
    initialData: [],
    async middleware(_, next) {
      const result = await next()

      return result.map((item) => ({
        label: item.modelName,
        value: item.id,
      }))
    },
  },
)

onSuccess(() => {
  if (type.value === 'add') {
    formData.modelId = modelOptions.value[0]?.value ?? ''
  }
})

const formItems2: FormItem[] = [
  {
    component: 'TRadioGroup',
    model: 'setup',
    options: [
      {
        label: '输入模式',
        value: 'enter',
      },
      {
        label: '展开模式',
        value: 'expand',
      },
    ],
    theme: 'button',
  },
  reactive({
    _label: '模型',
    clearable: false,
    component: 'TSelect',
    model: 'modelId',
    options: modelOptions,
  }),
  {
    _label: '模型温度',
    component: 'TInputNumber',
    decimalPlaces: 1,
    max: 2,
    min: 0,
    model: 'temperature',
    step: 0.1,
    theme: 'row',
  },
]
const formItems3: FormItem[] = [
  {
    component: 'TTextarea',
    maxlength: '',
    model: 'promptContent',
    placeholder: '你是一个文案撰写专家',
  },
]
</script>

<template>
  <div>
    <TCard :title="`品牌：${useListLabel('brand', brandId).value}`">
      <TForm :data="formData" :items="formItems"></TForm>
    </TCard>
    <TCard class="mt-4!" title="规则">
      <template #actions>
        <TForm
          label-align="right"
          :auto-label-width="false"
          class="no_item_mb flex!"
          :data="formData"
          :items="formItems2"
        ></TForm>
      </template>
      <TForm layout="vertical" :data="formData" :items="formItems3"></TForm>
    </TCard>
  </div>
</template>
