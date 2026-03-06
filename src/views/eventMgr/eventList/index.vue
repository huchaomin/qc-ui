<script setup lang="ts">
import EventRule from './modules/EventRule.vue'

const pageListRef = useTemplateRef('pageListRef')
// return [
//     {
//       model: 'eventName',
//       props: {
//         label: '事件名称',
//       },
//     },
//     {
//       props: {
//         label: '数据来源',
//       },
//       slot: 'source',
//     },
//     {
//       model: 'eventDesc',
//       props: {
//         label: '事件描述',
//         class: 'span_full',
//       },
//     },
//     {
//       model: 'relatedTask',
//       props: {
//         label: '关联数据',
//         class: 'span_full',
//       },
//       slot: 'relatedTask',
//     },
//     {
//       model: 'clusterTags',
//       props: {
//         class: 'span_full',
//         label: '聚类标签',
//         showCheckbox: true,
//         filterable: false,
//         multiple: true,
//         data: clusterTagsOptions.value,
//       },
//       component: 'CTreeSelect',
//     },
//     {
//       model: 'dataScope',
//       props: {
//         label: '内容发布时间',
//         type: 'daterange',
//       },
//       component: 'CDate',
//     },
//     {
//       model: 'effectiveTime',
//       props: {
//         label: '生效时间',
//         type: 'daterange',
//         rules: [{ required: String(formData.createTask) === '1', message: '必填' }],
//       },
//       component: 'CDate',
//     },
//     {
//       props: {
//         label: '选择策略',
//       },
//       slot: 'eventRule',
//     },
//     {
//       model: 'createTask',
//       props: {
//         label: '是否新建专项任务',
//         dicCode: 'yes_no',
//         disabled: type.value === 'edit',
//       },
//       component: 'CRadio',
//     },
//   ]
const formItemMap = {
  clusterTags: {
    _class: 'col-span-full',
    _label: '聚类标签',
    component: 'TTreeSelect',
    // data: clusterTagsOptions.value,
    filterable: false,
    multiple: true,
  },
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
  relatedTask: {
    _class: 'col-span-full',
    _label: '关联数据',
    _required: true,
    slot: 'relatedTask',
  },
  source: {
    _label: '数据来源',
    slot: 'source',
  },
} satisfies Record<string, FormItem>
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
                      formItemMap.dictName,
                      formItemMap.dictType,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                      formItemMap.remark,
                    ],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改字典类型',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/dict/type', {
                    ...(await formRef.value!.validate()),
                    dictId: row.dictId,
                  })
                  $msg.success('字典类型修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
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
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.dictName,
                formItemMap.dictType,
                {
                  ...formItemMap.status,
                  component: 'TRadioGroup',
                },
                formItemMap.remark,
              ],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加字典类型',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/type', await formRef.value!.validate())
            $msg.success('字典添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'yq:eventManage:add',
    },
    {
      default: '刷新缓存',
      onClick: async () => {
        await alovaInst.Delete('system/dict/type/refreshCache', undefined, {
          meta: {
            useSuccessMsg: true,
          },
        })
        pageListRef.value!.query()
      },
      permission: 'yq:eventManage:remove',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
