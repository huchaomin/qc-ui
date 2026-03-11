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
const data1 = reactive<Record<string, any>>({
  status: '0',
})
const data2 = reactive<Record<string, any>>({
  setup: 'enter',
  temperature: 0.1,
})
const data3 = reactive<Record<string, any>>({
  output: '文件Excel',
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
    data2.modelId = modelOptions.value[0]?.value ?? ''
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
  reactive({
    _rules: [
      {
        message: '请输入规则设定',
        required: true,
      },
    ],
    class: 'flex_height',
    component: 'TTextarea',
    maxlength: '',
    model: 'promptContent',
    placeholder: '你是一个文案撰写专家',
    show: computed(() => data2.setup === 'enter'),
  }),
  reactive({
    _label: '角色',
    component: 'TTextarea',
    maxlength: '',
    model: 'role',
    placeholder: '你是一个文案撰写专家',
    show: computed(() => data2.setup === 'expand'),
  }),
  reactive({
    _label: '背景',
    component: 'TTextarea',
    maxlength: '',
    model: 'background',
    placeholder: '你服务于-家AI公司，主要面向企业开发AI应用',
    show: computed(() => data2.setup === 'expand'),
  }),
  reactive({
    _label: '技能',
    component: 'TTextarea',
    maxlength: '',
    model: 'skills',
    placeholder: '查询知识库/查询文件:当用户咨询问题时，必须使用此技能',
    show: computed(() => data2.setup === 'expand'),
  }),
  reactive({
    _label: '任务',

    component: 'TTextarea',
    maxlength: '',
    model: 'tasks',
    placeholder: '从知识库中寻找最佳答案，解答客户问题',
    show: computed(() => data2.setup === 'expand'),
  }),
  reactive({
    _label: '要求',
    component: 'TTextarea',
    maxlength: '',
    model: 'requirements',
    placeholder: '一步一步思考:认真检查你的回答是否可以解决用户的问题',
    show: computed(() => data2.setup === 'expand'),
  }),
  reactive({
    _label: '输出格式',
    component: 'TRadioGroup',
    model: 'output',
    options: [
      {
        label: '文件Excel',
        value: '文件Excel',
      },
      {
        label: '文本输出',
        value: '文本输出',
      },
    ],
    show: computed(() => data2.setup === 'expand'),
  }),
]
const cardRef = useTemplateRef('cardRef')
const { height: _height } = useElementSize(
  () => cardRef.value?.$el.querySelector('.t-card__body') as HTMLElement,
)
const height = computed(() => (type.value === 'view' ? _height.value - 16 : _height.value - 52))
const form1Ref = useTemplateRef('form1Ref')
const form2Ref = useTemplateRef('form2Ref')
const form3Ref = useTemplateRef('form3Ref')

function getPromptContent(formData: Record<string, any>): string {
  let str = ''

  ;['background', 'skills', 'tasks', 'requirements'].forEach((key) => {
    str += `${formData[key as keyof typeof formData]}\n`
  })
  str += `输出格式: ${formData.output}`
  return str
}

async function handleSave(): Promise<void> {
  const [form1Data, form2Data, form3Data] = await Promise.all([
    form1Ref.value!.validate(),
    form2Ref.value!.validate(),
    form3Ref.value!.validate(),
  ])
  const data: Record<string, any> = {
    ...form1Data,
    ...form2Data,
    brandId,
    promptContent: form3Data.promptContent ?? getPromptContent(form3Data),
    promptContentJson: form2Data.setup === 'expand' ? JSON.stringify(form3Data) : '',
    promptRole: form3Data.role ?? '',
  }

  delete data.setup

  if (type.value === 'add') {
    await alovaInst.Post('yq/agentManage', data)
    $msg('新增智能体成功')
  } else {
    await alovaInst.Put('yq/agentManage', {
      ...data,
      id,
    })
    $msg('修改智能体成功')
  }

  useExcludeKPnameStore().add('AgentList')
  useRecentRoutersStore().close(route.name)
}

const { data: getAgentByIdData, onSuccess: onGetAgentByIdSuccess } = useRequest(
  alovaInst.Get<Record<string, any>>(`yq/agentManage/${id}`),
  {
    immediate: !isFalsy(id),
    initialData: [],
  },
)

onGetAgentByIdSuccess(() => {
  form1Ref.value!.setFormData(getAgentByIdData.value)
  form2Ref.value!.setFormData(getAgentByIdData.value)
  data2.setup = isFalsy(getAgentByIdData.value.promptContentJson) ? 'enter' : 'expand'
  data3.promptContent = getAgentByIdData.value.promptContent

  if (data2.setup === 'expand') {
    try {
      form3Ref.value!.setFormData(JSON.parse(getAgentByIdData.value.promptContentJson))
    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-4!">
    <TCard :title="`品牌：${useListLabel('brand', brandId).value}`">
      <TForm ref="form1Ref" :data="data1" :items="formItems" :disabled="type === 'view'"></TForm>
    </TCard>
    <TCard
      ref="cardRef"
      title="规则"
      class="flex-1"
      :body-class-name="`flex! flex-col min-h-[150px] ${data2.setup === 'enter' ? 'justify-end relative' : 'justify-between'}`"
      body-full-height
    >
      <template #actions>
        <TForm
          ref="form2Ref"
          label-align="right"
          :auto-label-width="false"
          class="no_item_mb flex!"
          :data="data2"
          :items="formItems2"
          :disabled="type === 'view'"
        ></TForm>
      </template>
      <TForm
        ref="form3Ref"
        :class="{
          'absolute top-4 right-6 left-6': data2.setup === 'enter',
        }"
        layout="vertical"
        :data="data3"
        :items="formItems3"
        :disabled="type === 'view'"
      ></TForm>
      <TButton v-if="type !== 'view'" block @click="handleSave"> 保存 </TButton>
    </TCard>
  </div>
</template>

<style scoped>
:deep() {
  .t-textarea {
    &.flex_height {
      textarea {
        height: calc(v-bind(height) * 1px) !important;
      }
    }
  }
}
</style>
