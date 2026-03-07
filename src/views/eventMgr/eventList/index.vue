<script setup lang="ts">
import { handPullComments } from '@/bus'
import ClusterTags from './modules/ClusterTags.vue'
import EventRule from './modules/EventRule.vue'
import RelatedTask from './modules/RelatedTask.vue'

const pageListRef = useTemplateRef('pageListRef')
const slotsMap = {
  cluster_tags: () => h(ClusterTags),
  event_rule: () => h(EventRule),
  related_task: () => h(RelatedTask),
}
const formItemMap = {
  cluster_tags: reactive({
    _class: 'col-span-full',
    _label: '聚类标签',
    model: 'clusterTags',
    slot: 'cluster_tags',
  }),
  createTask: {
    _label: '是否新建专项任务',
    component: 'TRadioGroup',
    dicCode: 'yes_no',
    model: 'createTask',
  },
  dataScope: {
    _label: '内容发布时间',
    _required: true,
    component: 'TDateRangePicker',
    model: 'dataScope',
  },
  effectiveTime: {
    __others: (formData) => {
      return {
        _required: formData.createTask === '1',
      }
    },
    _label: '生效时间',
    component: 'TDateRangePicker',
    model: 'effectiveTime',
  },
  event_rule: {
    _label: '选择策略',
    _required: true,
    model: 'eventRule',
    slot: 'event_rule',
  },
  eventDesc: {
    _class: 'col-span-full',
    _label: '事件描述',
    model: 'eventDesc',
  },
  eventName: {
    _label: '事件名称',
    _required: true,
    model: 'eventName',
  },
  related_task: {
    _class: 'col-span-full',
    _label: '关联数据',
    _required: true,
    model: 'relatedTask',
    slot: 'related_task',
  },
  source: {
    _label: '数据来源',
    component: 'TRadioGroup',
    model: 'source',
    options: [
      {
        label: '系统数据',
        value: '1',
      },
      {
        label: '导入Excel',
        value: '2',
      },
    ],
    readonly: true,
  },
} satisfies Record<string, FormItem>

function getSaveData(formData: Record<string, any>) {
  const obj: Record<string, any> = {
    ...formData,
    clusterTags: formData.clusterTags.join(','),
    dataScope: formData.dataScope.join(','),
    effectiveEndTime: formData.effectiveTime?.[1] ?? '',
    effectiveStartTime: formData.effectiveTime?.[0] ?? '',
    relatedFollow: formData.relatedTask
      .filter((value: string) => value.endsWith('_follow'))
      .map((value: string) => value.slice(0, -7))
      .join(','),
    relatedTask: formData.relatedTask
      .filter((value: string) => !value.endsWith('_follow'))
      .join(','),
  }

  delete obj.effectiveTime
  delete obj.source
  return obj
}

const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/eventManage',
      permission: 'yq:eventManage:remove',
    },
    list: {
      method: 'yq/eventManage/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '事件编号',
    },
    useEventNameColumn(),
    {
      cell: (_, { row }) => {
        return {
          _component: 'Link',
          default: '查看',
          onClick: () => {
            void $confirm({
              body: () => h(EventRule, {}),
              header: '事件策略',
              width: 800, // 730
            })
          },
        }
      },
      colKey: 'eventRule',
      title: '事件策略',
    },
    {
      cell: {
        _component: 'OptionLabel',
        multiple: true,
        options: 'task',
      },
      colKey: 'relatedTask',
      resize: {
        maxWidth: 300,
      },
      title: '关联数据',
    },
    {
      colKey: 'dataScope',
      title: '发布时间',
    },
    {
      colKey: 'totalCount',
      title: '分析内容数',
    },
    {
      colKey: 'eventCount',
      title: '命中内容数',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'event_execution_status',
      },
      colKey: 'executionStatus',
      title: '执行状态',
    },
    {
      colKey: 'executionTime',
      title: '执行时间',
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
                  formRef.value!.setFormData(row, {
                    override: {
                      effectiveTime: [row.effectiveStartTime, row.effectiveEndTime],
                      relatedTask: [
                        ...(row.relatedTask ?? '').split(',').filter(Boolean),
                        ...(row.relatedFollow ?? '')
                          .split(',')
                          .filter(Boolean)
                          .map((id: string) => `${id}_follow`),
                      ],
                      source: '1',
                    },
                    splitToArrKeys: ['clusterTags', 'dataScope'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      items: [
                        formItemMap.eventName,
                        formItemMap.source,
                        formItemMap.eventDesc,
                        formItemMap.related_task,
                        formItemMap.cluster_tags,
                        formItemMap.dataScope,
                        formItemMap.effectiveTime,
                        formItemMap.event_rule,
                        {
                          ...formItemMap.createTask,
                          disabled: true,
                        },
                      ],
                      ref: formRef,
                    },
                    slotsMap,
                  ),
                header: '修改事件',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/eventManage', {
                    ...getSaveData(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('事件修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
          }),
          ({ row }) => ({
            default: '重跑',
            disabled: row.executionStatus === 0,
            onClick: async () => {
              await $confirm(`确认要重跑【${row.eventName}】事件吗?`)
              await alovaInst.Put(`yq/eventManage/reRunEvent/${row.id}`)
              $msg('重跑成功')
              pageListRef.value!.query()
            },
            permission: 'yq:eventRule:reRunEvent',
          }),
          ({ row }) => ({
            default: '更新评论',
            onClick: async () => {
              await handPullComments({
                funcId: row.id,
                funcName: row.eventName,
                funcType: 3,
              })
            },
            permission: 'data:commentInfo:handPullComments',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    {
      _label: '事件编号',
      model: 'id',
    },
    formItemMap.eventName,
    {
      _label: '执行状态',
      component: 'TSelect',
      dicCode: 'event_execution_status',
      model: 'executionStatus',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(
              resolveComponent('TForm') as Component<FormProps>,
              {
                data: reactive({
                  clusterTags: [],
                  createTask: '0',
                  relatedTask: [],
                  source: '1',
                }),
                items: [
                  formItemMap.eventName,
                  formItemMap.source,
                  formItemMap.eventDesc,
                  formItemMap.related_task,
                  formItemMap.cluster_tags,
                  formItemMap.dataScope,
                  formItemMap.effectiveTime,
                  formItemMap.event_rule,
                  formItemMap.createTask,
                ],
                ref: formRef,
              },
              {
                ...slotsMap,
                related_task: () =>
                  h(RelatedTask, {
                    fillAll: true,
                  }),
              },
            ),
          header: '添加事件',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/eventManage', getSaveData(await formRef.value!.validate()))
            $msg.success('事件添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:eventManage:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
