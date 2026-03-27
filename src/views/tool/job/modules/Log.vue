<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string
  }>(),
  {},
)
const pageListRef = useTemplateRef('pageListRef')
const { data: jobData, send } = useRequest(
  (id) => alovaInst.Get<Record<string, any>>(`monitor/job/${id}`),
  {
    immediate: false,
    initialData: {},
  },
)

if (props.id === undefined) {
  nextTick(() => {
    pageListRef.value!.query()
  })
} else {
  send(props.id).then(() => {
    nextTick(() => {
      pageListRef.value!.query()
    })
  })
}

const formItemMap = {
  createTime: {
    _label: '执行时间',
    model: 'createTime',
  },
  exceptionInfo: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.status === '1',
      }
    },
    _class: 'col-span-full',
    _label: '异常信息',
    component: 'TTextarea',
    maxlength: '',
    model: 'exceptionInfo',
  },
  invokeTarget: {
    _class: 'col-span-full',
    _label: '调用目标方法',
    component: 'TTextarea',
    model: 'invokeTarget',
  },
  jobGroup: {
    _label: '任务分组',
    component: 'TSelect',
    dicCode: 'sys_job_group',
    model: 'jobGroup',
  },
  jobLogId: {
    _label: '日志编号',
    model: 'jobLogId',
  },
  jobMessage: {
    _class: 'col-span-full',
    _label: '日志信息',
    component: 'TTextarea',
    maxlength: '',
    model: 'jobMessage',
  },
  jobName: {
    _label: '任务名称',
    model: 'jobName',
  },
  status: {
    _label: '执行状态',
    component: 'TRadioGroup',
    dicCode: 'sys_job_status',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'monitor/jobLog',
      permission: 'monitor:job:remove',
      showBatch: true,
    },
    export: {
      method: 'monitor/jobLog/export',
      permission: 'monitor:job:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('monitor/jobLog/list', {
          params: {
            ...o,
            dateRange: undefined,
            'params[beginTime]': o.dateRange[0] ?? '',
            'params[endTime]': o.dateRange[1] ?? '',
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    {
      colKey: 'jobLogId',
      title: '日志编号',
    },
    {
      colKey: 'jobName',
      title: '任务名称',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_job_group',
      },
      colKey: 'jobGroup',
      title: '任务组名',
    },
    {
      colKey: 'invokeTarget',
      title: '调用目标字符串',
    },
    {
      colKey: 'jobMessage',
      title: '日志信息',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_job_status',
      },
      colKey: 'status',
      title: '执行状态',
    },
    {
      colKey: 'createTime',
      title: '执行时间',
    },
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '详情',
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
                  h(TForm, {
                    items: [
                      formItemMap.jobLogId,
                      formItemMap.jobName,
                      formItemMap.jobGroup,
                      formItemMap.createTime,
                      formItemMap.invokeTarget,
                      formItemMap.jobMessage,
                      formItemMap.status,
                      formItemMap.exceptionInfo,
                    ],
                    readonly: true,
                    ref: formRef,
                  }),
                footer: false,
                header: '调度日志详细',
                width: 730,
              })
            },
            permission: 'monitor:job:query',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.jobName,
    formItemMap.jobGroup,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
    {
      _class: 'col-span-2',
      _label: '执行时间',
      component: 'TDateRangePicker',
      model: 'dateRange',
    },
  ],
  initialFormData: reactive({
    jobGroup: computed(() => jobData.value.jobGroup ?? ''),
    jobName: computed(() => jobData.value.jobName ?? ''),
  }),
  isFirstQueryByParent: true,
  operations: [
    {
      default: '清空',
      permission: 'monitor:job:remove',
      popconfirm: {
        content: '确认清空吗',
        onConfirm: async () => {
          await alovaInst.Delete('monitor/jobLog/clean')
          $msg.success('清空成功')
          pageListRef.value!.query()
        },
      },
    },
  ],
  tableOtherProps: {
    flexHeight: false,
    rowKey: 'jobLogId',
    showColumnConfigBtn: false,
    showRowSelect: 'multiple',
    showToggleFullscreenBtn: false,
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
