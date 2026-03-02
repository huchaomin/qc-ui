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

          if (value === '2') {
            if (wordsType2Data.value.length === 0) {
              wordsType2Send()
            }
          } else {
            if (neWordsType2Data.value.length === 0) {
              neWordsType2Send()
            }
          }
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

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row)
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      formItemMap.brandName,
                      formItemMap.contacts,
                      formItemMap.contactsPhone,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                      formItemMap.screenData,
                      formItemMap.contactsEmail,
                      formItemMap.remark,
                    ],
                    ref: formRef,
                  }),
                header: '修改品牌',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/task', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('品牌修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:task:edit',
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
    {
      default: '发送邮件',
      onClick: async () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                brandIds: [],
                days: 1,
                reportType: '1',
              }),
              items: [
                {
                  _label: '距今天数',
                  _required: true,
                  component: 'TInputNumber',
                  decimalPlaces: 0,
                  max: 365,
                  min: 1,
                  model: 'days',
                },
                {
                  __others: (formData) => {
                    return {
                      onChange: () => {
                        formData.taskIds = []
                      },
                    }
                  },
                  _label: '品牌',
                  _required: true,
                  component: 'TSelect',
                  model: 'brandIds',
                  multiple: true,
                  options: 'brand',
                },
                {
                  __others: (formData) => {
                    return {
                      disabled: formData.brandIds.length === 0,
                      options: useList('task').value.filter((item) =>
                        formData.brandIds.includes(item.brandId),
                      ),
                    }
                  },
                  _label: '任务',
                  component: 'TSelect',
                  model: 'taskIds',
                  multiple: true,
                },
                {
                  _label: '日报类型',
                  component: 'TRadioGroup',
                  model: 'reportType',
                  options: [
                    {
                      label: '老日报',
                      value: '0',
                    },
                    {
                      label: '新日报',
                      value: '1',
                    },
                  ],
                },
              ],
              ref: formRef,
            }),
          header: '确认发送邮件',
          onConfirmCallback: async () => {
            await alovaInst.Post(
              'yq/task/sendEmails',
              {
                ...(await formRef.value!.validate()),
                ids: pageListRef.value!.selectedRows.map((item) => item.id),
              },
              {
                meta: {
                  useLoading: '邮件发送中...',
                },
                timeout: 0,
              },
            )
            $msg('邮件发送成功')
          },
          width: 430, // 730
        })
      },
      permission: 'task:monitorTask:sendEmails',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
