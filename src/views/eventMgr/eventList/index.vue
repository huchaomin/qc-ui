<script setup lang="ts">
import type { DateValue } from 'tdesign-vue-next'
import { handPullComments } from '@/bus'
import { viewEventStrategy } from '../eventStrategy/index.vue'
import ClusterTags from './modules/ClusterTags.vue'
import EventRule from './modules/EventRule.vue'
// import RelatedTask from './modules/RelatedTask.vue'

const pageListRef = useTemplateRef('pageListRef')
const slotMap = {
  cluster_tags: () => h(ClusterTags),
  event_rule: () => h(EventRule),
  // related_task: () => h(RelatedTask),
}
const formItemMap = {
  cluster_tags: reactive({
    _class: 'col-span-full',
    _label: '聚类标签',
    model: 'clusterTags',
    slot: 'cluster_tags',
  }),
  dataScope: {
    _label: '内容发布结束时间类型',
    component: 'TRadioGroup',
    model: 'dataScope',
    options: [
      {
        label: '选择时间',
        value: '0',
      },
      {
        label: '最新时间',
        value: '1',
      },
    ],
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
  publishTimeEnd: {
    __others: (formData) => {
      const dataMonth = useList('brand').value[0]?.dataMonth ?? 0

      return {
        disableDate: (date: DateValue) => {
          const start = isFalsy(formData.publishTimeStart)
            ? dayjs().subtract(dataMonth, 'month').startOf('day')
            : dayjs(formData.publishTimeStart)
          const end = dayjs().endOf('day')

          return dayjs(date).isBefore(start) || dayjs(date).isAfter(end)
        },
        show: formData.dataScope === '0',
      }
    },
    _label: '内容发布结束时间',
    _required: true,
    component: 'TDatePicker',
    defaultTime: dayjs().endOf('day').format('HH:mm:ss'),
    enableTimePicker: true,
    model: 'publishTimeEnd',
  },
  publishTimeStart: {
    __others: (formData) => {
      const dataMonth = useList('brand').value[0]?.dataMonth ?? 0

      return {
        disableDate: (date: DateValue) => {
          const start = dayjs().subtract(dataMonth, 'month').startOf('day')
          const end =
            isFalsy(formData.publishTimeEnd) || formData.dataScope === '1'
              ? dayjs().endOf('day')
              : dayjs(formData.publishTimeEnd)

          return dayjs(date).isBefore(start) || dayjs(date).isAfter(end)
        },
      }
    },
    _label: '内容发布开始时间',
    _required: true,
    component: 'TDatePicker',
    enableTimePicker: true,
    model: 'publishTimeStart',
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
  }

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
            viewEventStrategy(row.eventRule)
          },
        }
      },
      colKey: 'eventRule',
      title: '事件策略',
    },
    {
      colKey: 'publishTimeStart',
      title: '发布开始时间',
    },
    {
      cell: (_, { row }) => {
        return row.dataScope === '0' ? row.publishTimeEnd : '当天'
      },
      colKey: 'publishTimeEnd',
      title: '发布结束时间',
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
                      source: '1',
                    },
                    splitToArrKeys: ['clusterTags'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(
                    TForm,
                    {
                      items: [
                        formItemMap.eventName,
                        formItemMap.source,
                        formItemMap.eventDesc,
                        formItemMap.cluster_tags,
                        formItemMap.publishTimeStart,
                        formItemMap.dataScope,
                        formItemMap.publishTimeEnd,
                        formItemMap.event_rule,
                      ],
                      ref: formRef,
                    },
                    slotMap,
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
            permission: 'yq:eventManage:edit',
          }),
          ({ row }) => ({
            default: '重跑',
            disabled: row.executionStatus === 0,
            permission: 'yq:eventRule:reRunEvent',
            popconfirm: {
              content: `确认要重跑【${row.eventName}】事件吗?`,
              onConfirm: async () => {
                await alovaInst.Put(`yq/eventManage/reRunEvent/${row.id}`)
                $msg('重跑成功')
                pageListRef.value!.query()
              },
            },
          }),
          ({ row }) => ({
            default: '更新评论',
            permission: 'data:commentInfo:handPullComments',
            popconfirm: {
              content: '确认要更新评论吗？',
              onConfirm: async () => {
                await handPullComments({
                  funcId: row.id,
                  funcName: row.eventName,
                  funcType: 3,
                })
              },
            },
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
              TForm,
              {
                data: reactive({
                  clusterTags: [],
                  dataScope: '0',
                  source: '1',
                }),
                items: [
                  formItemMap.eventName,
                  formItemMap.source,
                  formItemMap.eventDesc,
                  formItemMap.cluster_tags,
                  formItemMap.publishTimeStart,
                  formItemMap.dataScope,
                  formItemMap.publishTimeEnd,
                  formItemMap.event_rule,
                ],
                ref: formRef,
              },
              slotMap,
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
