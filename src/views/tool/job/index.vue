<script setup lang="ts">
import Log from './modules/Log.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  concurrent: {
    _label: '是否并发',
    component: 'TRadioGroup',
    model: 'concurrent',
    options: [
      {
        label: '允许',
        value: '0',
      },
      {
        label: '禁止',
        value: '1',
      },
    ],
  },
  createTime: {
    _label: '创建时间',
    model: 'createTime',
  },
  cronExpression: {
    _label: 'cron表达式',
    _required: true,
    model: 'cronExpression',
  },
  invokeTarget: {
    _class: 'col-span-full',
    _label: '调用方法',
    _required: true,
    component: 'TTextarea',
    model: 'invokeTarget',
    placeholder: `Bean调用示例：ryTask.ryParams('ry')
Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
参数说明：支持字符串，布尔类型，长整型，浮点型，整型`,
  },
  jobGroup: {
    _label: '任务组名',
    component: 'TSelect',
    dicCode: 'sys_job_group',
    model: 'jobGroup',
  },
  jobId: {
    _label: '任务编号',
    model: 'jobId',
  },
  jobName: {
    _label: '任务名称',
    _required: true,
    model: 'jobName',
  },
  misfirePolicy: {
    _label: '执行策略',
    component: 'TRadioGroup',
    model: 'misfirePolicy',
    options: [
      {
        label: '立即执行',
        value: '1',
      },
      {
        label: '执行一次',
        value: '2',
      },
      {
        label: '放弃执行',
        value: '3',
      },
    ],
  },
  nextValidTime: {
    _label: '下次执行时间',
    model: 'nextValidTime',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'sys_job_status',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'monitor/job',
      permission: 'monitor:job:remove',
    },
    export: {
      method: 'monitor/job/export',
      permission: 'monitor:job:export',
    },
    list: {
      method: 'monitor/job/list',
    },
  },
  columns: [
    {
      colKey: 'jobId',
      title: '任务编号',
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
      colKey: 'cronExpression',
      title: 'cron执行表达式',
    },
    {
      cell: (_, { row }) => {
        return {
          _component: 'Switch',
          beforeChange: async () => {
            const text = row.status === '1' ? '启用' : '停用'

            await $confirm(`确认${text}${row.jobName}任务吗？`)
            await alovaInst.Put(
              'monitor/job/changeStatus',
              {
                jobId: row.jobId,
                status: row.status === '1' ? '0' : '1',
              },
              {
                meta: {
                  useSuccessMsg: true,
                },
              },
            )
            pageListRef.value!.query()
            return true
          },
          customValue: ['0', '1'], // 0 有效 1 无效
        }
      },
      colKey: 'status',
      title: '状态',
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
                  h(TForm, {
                    items: [
                      formItemMap.jobName,
                      formItemMap.jobGroup,
                      formItemMap.invokeTarget,
                      formItemMap.cronExpression,
                      formItemMap.status,
                      formItemMap.misfirePolicy,
                      formItemMap.concurrent,
                    ],
                    ref: formRef,
                  }),
                header: '修改任务',
                onConfirmCallback: async () => {
                  await alovaInst.Put('monitor/job', {
                    ...(await formRef.value!.validate()),
                    jobId: row.jobId,
                  })
                  $msg.success('任务修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'monitor:job:edit',
          }),
          ({ row }) => ({
            default: '执行一次',
            permission: 'monitor:job:changeStatus',
            popconfirm: {
              content: `确认要立即执行一次${row.jobName}任务吗?`,
              onConfirm: async () => {
                await alovaInst.Put(
                  'monitor/job/run',
                  {
                    jobGroup: row.jobGroup,
                    jobId: row.jobId,
                  },
                  {
                    meta: {
                      useSuccessMsg: true,
                    },
                  },
                )
              },
            },
          }),
          ({ row }) => ({
            default: '任务详细',
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
                      formItemMap.jobId,
                      formItemMap.jobName,
                      formItemMap.jobGroup,
                      formItemMap.createTime,
                      formItemMap.cronExpression,
                      formItemMap.nextValidTime,
                      formItemMap.invokeTarget,
                      formItemMap.status,
                      formItemMap.misfirePolicy,
                      formItemMap.concurrent,
                    ],
                    readonly: true,
                    ref: formRef,
                  }),
                footer: false,
                header: '任务详细',
                width: 730,
              })
            },
            permission: 'monitor:job:query',
          }),
          ({ row }) => ({
            default: '调度日志',
            onClick: () => {
              $dialog({
                body: () =>
                  h(Log, {
                    id: row.jobId,
                  }),
                footer: false,
                header: '查看调度日志',
                width: 1500,
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
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(TForm, {
              data: reactive({
                concurrent: '1',
                misfirePolicy: '1',
                status: '0',
              }),
              items: [
                formItemMap.jobName,
                formItemMap.jobGroup,
                formItemMap.invokeTarget,
                formItemMap.cronExpression,
                formItemMap.misfirePolicy,
                formItemMap.concurrent,
              ],
              ref: formRef,
            }),
          header: '新增任务',
          onConfirmCallback: async () => {
            await alovaInst.Post('monitor/job', await formRef.value!.validate())
            $msg.success('任务新增成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'monitor:job:add',
    },
    {
      default: '日志',
      onClick: () => {
        $dialog({
          body: () => h(Log),
          footer: false,
          header: '查看调度日志',
          width: 1500,
        })
      },
      permission: 'monitor:job:query',
    },
  ],
  tableOtherProps: {
    rowKey: 'jobId',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
