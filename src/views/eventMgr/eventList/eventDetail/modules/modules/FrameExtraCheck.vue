<script setup lang="ts">
import ExtraCfgList from './ExtraCfgList.vue'
import FrameExtraCheckDetail from './FrameExtraCheckDetail.vue'

const props = withDefaults(
  defineProps<{
    rows: Array<Record<string, any>>
  }>(),
  {},
)
const selectedRowKeysY = ref<Array<string>>([])
const selectedRowKeysN = ref<Array<string>>([])
const selectedRowKeys = computed(() => {
  return [...selectedRowKeysY.value, ...selectedRowKeysN.value]
})
const columns: TableCol[] = [
  {
    ...useVideoTitleColumn({
      useLink: false,
    }),
    resize: {
      maxWidth: 400,
    },
  },
  {
    colKey: 'publishTime',
    title: '发布时间',
  },
  useAuthorNameColumn({
    useLink: false,
  }),
]
const extraFlagYArr = computed(() => {
  return props.rows.filter((item) => item.extraFlag === 'Y')
})
const extraFlagNArr = computed(() => {
  return props.rows.filter((item) => item.extraFlag === 'N')
})
const extraNumTypeOptions = useDicOptions('extra_num_type')
const formData = reactive<Record<string, any>>({})
const initExtraCfgList = ref<Array<Record<string, any>>>([])

watch(extraNumTypeOptions, (val) => {
  formData.extraNum = val.find((item) => item.value === '1')?.remark ?? ''

  const str = val.find((item) => item.value === '2')?.remark ?? ''

  try {
    initExtraCfgList.value = JSON.parse(str)
  } catch {
    initExtraCfgList.value = []
  }
})

const formItems: FormItem[] = [
  {
    __others: (formData: Record<string, any>) => {
      return {
        onChange: () => {
          formData.extraNumType = ''
        },
      }
    },
    _label: '抽帧类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'extra_type',
    model: 'extraType',
  },
  {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.extraType === '2',
      }
    },
    _label: '数量抽帧配置',
    _required: true,
    component: 'TSelect',
    dicCode: 'extra_num_type',
    model: 'extraNumType',
  },
  {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.extraNumType === '1',
      }
    },
    _label: '固定帧数',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'extraNum',
  },
  {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.extraNumType === '2',
      }
    },
    _class: 'col-span-full',
    _label: '抽帧配置',
    _required: true,
    model: 'extraCfgList',
    slot: 'extraCfgList',
  },
]
const formRef = ref<FormInstance | null>(null)

function handleSubmit(): Promise<void> {
  return new Promise((resolve) => {
    if (selectedRowKeys.value.length === 0) {
      $msg.error('请选择需要抽帧的视频')
      return
    }

    formRef.value!.validate().then((data) => {
      const params = {
        bciIds: selectedRowKeys.value,
        eventId: props.rows[0].eventId,
        ...data,
      }

      alovaInst
        .Post<Record<string, any>>('yq/frameExtraRecord/frameExtraCheck', params)
        .then((result) => {
          const compoRef = ref<InstanceType<typeof FrameExtraCheckDetail> | null>(null)

          void $confirm({
            body: () =>
              h(FrameExtraCheckDetail, {
                ref: compoRef,
                result,
              }),
            header: '抽帧检查确认',
            onConfirmCallback: async () => {
              await alovaInst.Post('yq/frameExtraRecord/startFrameExtra', params)
              $msg('抽帧检查成功')
              resolve()
            },
            width: 680,
          })
        })
    })
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div v-if="extraFlagYArr.length > 0" class="mb-4">
    以下选项已抽帧检查过：
    <TTable
      v-model:selected-row-keys="selectedRowKeysY"
      row-key="bciId"
      show-row-select="multiple"
      :columns="columns"
      :data="extraFlagYArr"
    ></TTable>
  </div>
  <div v-if="extraFlagNArr.length > 0">
    以下选项暂未抽帧检查过：
    <TTable
      v-model:selected-row-keys="selectedRowKeysN"
      row-key="bciId"
      show-row-select="multiple"
      :columns="columns"
      :data="extraFlagNArr"
    ></TTable>
  </div>
  <TForm ref="formRef" class="mt-4!" :data="formData" :items="formItems">
    <template #extraCfgList>
      <ExtraCfgList :initial-data="initExtraCfgList" />
    </template>
  </TForm>
</template>
