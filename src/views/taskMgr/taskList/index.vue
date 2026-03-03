<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const { data: wordsType2Data, send: wordsType2Send } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/monitorPhrase/getList', {
    params: {
      wordsType: '2',
    },
  }),
  {
    immediate: false,
    initialData: [],
  },
)
const { data: neWordsType2Data, send: neWordsType2Send } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/monitorPhrase/getList', {
    params: {
      neWordsType: '2',
    },
  }),
  {
    immediate: false,
    initialData: [],
  },
)

function taskTypeChange(taskType: string) {
  if (taskType === '2') {
    if (wordsType2Data.value.length === 0) {
      wordsType2Send()
    }
  } else {
    if (neWordsType2Data.value.length === 0) {
      neWordsType2Send()
    }
  }
}

const formItemMap = {
  brandId: {
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  daysToToday: {
    _label: '数据距今天数',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'daysToToday',
    useGrouping: false,
  },
  monitorPhraseIds: {
    __others: (formData) => {
      return {
        disabled: isFalsy(formData.taskType),
        options: (isFalsy(formData.taskType)
          ? []
          : formData.taskType === '2'
            ? wordsType2Data.value
            : neWordsType2Data.value
        ).map((item) => {
          return {
            ...item,
            content: () =>
              h(
                'div',
                {
                  class: 'flex items-center justify-between',
                },
                [
                  h('span', item.name),
                  h(
                    'span',
                    {
                      class: 'text-[var(--td-font-gray-3)] text-xs',
                    },
                    useDicLabel('words_type', item.wordsType).value,
                  ),
                ],
              ),
          }
        }),
      }
    },
    _label: '搜索词组',
    _required: true,
    component: 'TSelect',
    keys: {
      label: 'name',
      value: 'id',
    },
    model: 'monitorPhraseIds',
    multiple: true,
  },
  name: {
    _label: '任务名称',
    _required: true,
    model: 'name',
  },
  priority: {
    _label: '优先级-数字越大优先级越高',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    max: 99,
    model: 'priority',
    theme: 'row',
  },
  searchFrequency: {
    _label: '搜索频次',
    _required: true,
    component: 'Cron',
    model: 'searchFrequency',
  },
  startEndTime: {
    __others: (formData) => {
      return {
        _required: formData.taskType === '1',
        show: formData.taskType === '1',
      }
    },
    _class: 'col-span-2',
    _label: '生效时间',
    component: 'TDateRangePicker',
    enableTimePicker: true,
    model: 'startEndTime',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  targetDesc: {
    _label: '目标描述',
    model: 'targetDesc',
  },
  taskType: {
    __others: (formData) => {
      return {
        onChange: (value: any) => {
          formData.monitorPhraseIds = []
          taskTypeChange(value)
        },
      }
    },
    _label: '任务类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'task_type',
    model: 'taskType',
  },
  useBrandWx: {
    _label: '是否使用品牌视频媒体池',
    component: 'TRadioGroup',
    dicCode: 'sys_yes_no',
    model: 'useBrandWx',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/task',
      permission: 'yq:task:remove',
    },
    export: {
      method: 'yq/task/export',
      permission: 'yq:task:export',
    },
    list: {
      method: 'yq/task/list',
    },
  },
  columns: [
    useTaskNameNameColumn(),
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'task_type',
      },
      colKey: 'taskType',
      title: '任务类型',
    },
    {
      cell: {
        _component: 'OptionLabel',
        multiple: true,
        options: 'monitorPhrase',
      },
      colKey: 'monitorPhraseIds',
      title: '搜索词组',
    },
    {
      colKey: 'monitorWords',
      resize: {
        maxWidth: 300,
      },
      title: '搜索词名称',
    },
    {
      colKey: 'currentSearchWord',
      resize: {
        maxWidth: 300,
      },
      title: '当前搜索词',
    },
    {
      colKey: 'targetDesc',
      title: '目标描述',
    },
    {
      cell: {
        _component: 'FormatDate',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      colKey: 'lastRunStartTime',
      title: '最近执行开始时间',
    },
    {
      cell: {
        _component: 'FormatDate',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      colKey: 'lastRunEndTime',
      title: '最近执行完成时间',
    },
    {
      colKey: 'searchFrequency',
      title: '搜索频次',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'run_status',
      },
      colKey: 'runStatus',
      title: '执行状态',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'status',
      },
      colKey: 'status',
      title: '状态',
    },
    {
      colKey: 'execNum',
      title: '执行次数',
    },
    {
      colKey: 'monitorVideoNum',
      title: '监控信息数量',
    },
    {
      colKey: 'monitorFileTotal',
      title: '文件大小',
    },
    {
      cell: {
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌',
    },
    {
      colKey: 'wxClientId',
      title: '指定视频媒体id',
    },
    {
      colKey: 'priority',
      title: '优先级-数字越大优先级越高',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_yes_no',
      },
      colKey: 'useBrandWx',
      title: '是否使用品牌视频媒体池',
    },
    {
      colKey: 'daysToToday',
      title: '数据距今天数',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      colKey: 'updateTime',
      title: '更新时间',
    },
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '编辑',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              taskTypeChange(row.taskType)
              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row, {
                    override: {
                      startEndTime: row.taskType === '1' ? [row.startTime, row.endTime] : [],
                    },
                    splitToArrKeys: ['monitorPhraseIds'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      formItemMap.name,
                      formItemMap.taskType,
                      formItemMap.startEndTime,
                      formItemMap.brandId,
                      formItemMap.monitorPhraseIds,
                      formItemMap.targetDesc,
                      formItemMap.searchFrequency,
                      formItemMap.priority,
                      formItemMap.daysToToday,
                      formItemMap.useBrandWx,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '修改任务',
                onConfirmCallback: async () => {
                  const formData = await formRef.value!.validate()

                  formData.monitorPhraseIds = formData.monitorPhraseIds.join(',')

                  if (formData.taskType === '1') {
                    formData.startTime = formData.startEndTime[0]
                    formData.endTime = formData.startEndTime[1]
                  }

                  delete formData.startEndTime
                  await alovaInst.Put('yq/task', {
                    ...formData,
                    id: row.id,
                  })
                  $msg.success('任务修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:task:edit',
          }),
          ({ row }) => ({
            default: '清除搜索词',
            onClick: async () => {
              await $confirm(`确认要清除【${row.name}】任务的搜索词吗？`)
              await alovaInst.Post('yq/task/clearCurrentSearchWord', {
                id: row.id,
              })
              $msg.success('搜索词清除成功')
              pageListRef.value!.query()
            },
            permission: 'yq:monitorTask:clearCurrentSearchWord',
          }),
          ({ row }) => ({
            default: '修改数据源',
            onClick: async () => {
              const formRef = ref<FormInstance | null>(null)

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row, {
                    splitToArrKeys: ['dataSources', 'platformName'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    data: reactive({
                      dataSources: [],
                    }),
                    items: [
                      {
                        _label: '数据源',
                        _required: true,
                        component: 'TCheckboxGroup',
                        dicCode: 'data_source',
                        model: 'dataSources',
                      },
                      {
                        __others: (formData) => {
                          return {
                            show: formData.dataSources.includes('5'),
                          }
                        },
                        _label: '中文名',
                        component: 'TCheckboxGroup',
                        dicCode: 'qb_platform_name',
                        model: 'platformName',
                      },
                    ],
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改数据源',
                onConfirmCallback: async () => {
                  const formData = await formRef.value!.validate()

                  await alovaInst.Put('yq/task/updateDataSources', {
                    dataSources: formData.dataSources.join(','),
                    id: row.id,
                    platformName: formData.platformName?.join(',') ?? '',
                  })
                  $msg.success('数据源修改成功')
                  pageListRef.value!.query()
                },
              })
            },
            permission: 'yq:task:updateDataSources',
          }),
          ({ row }) => ({
            default: '开启',
            onClick: async () => {
              await $confirm(`确认要立即开启【${row.name}】任务吗？`)
              await alovaInst.Post('yq/task/runTask', {
                id: row.id,
              })
              $msg.success('执行成功')
              pageListRef.value!.query()
            },
            permission: 'yq:task:runTask',
            show: row.runStatus === 1,
          }),
          ({ row }) => ({
            default: '暂停',
            onClick: async () => {
              await $confirm(`确认要立即暂停【${row.name}】任务吗？`)
              await alovaInst.Post('yq/task/breakTask', {
                id: row.id,
              })
              $msg.success('暂停成功')
              pageListRef.value!.query()
            },
            permission: 'yq:task:breakTask',
            show: row.runStatus === 0,
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.name,
    formItemMap.brandId,
    formItemMap.taskType,
    {
      _label: '搜索词组',
      component: 'TSelect',
      model: 'monitorPhraseId',
      options: 'monitorPhrase',
    },
    {
      _label: '搜索词名称',
      model: 'monitorWords',
    },
    {
      _label: '执行状态',
      component: 'TSelect',
      dicCode: 'run_status',
      model: 'runStatus',
    },
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                status: '0',
                useBrandWx: 'N',
              }),
              items: [
                formItemMap.name,
                formItemMap.taskType,
                formItemMap.startEndTime,
                formItemMap.brandId,
                formItemMap.monitorPhraseIds,
                formItemMap.targetDesc,
                formItemMap.searchFrequency,
                formItemMap.priority,
                formItemMap.daysToToday,
                formItemMap.useBrandWx,
                formItemMap.status,
              ],
              ref: formRef,
            }),
          header: '新增任务',
          onConfirmCallback: async () => {
            const formData = await formRef.value!.validate()

            formData.monitorPhraseIds = formData.monitorPhraseIds.join(',')

            if (formData.taskType === '1') {
              formData.startTime = formData.startEndTime[0]
              formData.endTime = formData.startEndTime[1]
            }

            delete formData.startEndTime
            await alovaInst.Post('yq/task', formData)
            $msg.success('任务新增成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:task:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
