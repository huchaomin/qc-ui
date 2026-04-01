<script setup lang="ts">
import PushTarget from './modules/PushTarget.vue'
import WarnRule from './modules/WarnRule.vue'
import WarnTemplate from './modules/WarnTemplate.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandId: {
    __others: (formData: Record<string, any>) => {
      return {
        show: ['1', '3'].includes(formData.range),
      }
    },
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  name: {
    _label: '预警推送名称',
    _required: true,
    model: 'name',
  },
  push_target: {
    _class: 'col-span-full',
    _label: '推送目标',
    _required: true,
    model: 'pushTarget',
    slot: 'push_target',
  },
  pushFrequency: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.pushType === '2',
      }
    },
    _label: '推送频率',
    _required: true,
    component: 'Cron',
    model: 'pushFrequency',
  },
  pushType: {
    _label: '推送类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'push_type',
    model: 'pushType',
  },
  range: {
    _label: '预警范围',
    _required: true,
    component: 'TSelect',
    dicCode: 'warn_range',
    model: 'range',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  taskId: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.range === '2',
      }
    },
    _label: '任务',
    _required: true,
    component: 'TSelect',
    model: 'taskId',
    options: 'task',
  },
  warn_rule: {
    _class: 'col-span-full',
    _label: '预警推送规则',
    _required: true,
    model: 'warnRule',
    slot: 'warn_rule',
  },
  warn_template: {
    _class: 'col-span-full',
    _label: '推送模板',
    _required: true,
    model: 'warnTemplate',
    slot: 'warn_template',
  },
} satisfies Record<string, FormItem>

function getSaveData(data: Record<string, any>): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    if (data.range === '2') {
      data.brandId = useList('task').value.find((item) => item.value === data.taskId)!.brandId
    } else if (data.range === '3') {
      if (data.warnRule.some((item: any) => item.ruleType !== '1')) {
        $msg.warning('直播预告只能配置策略预警')
        return
      }
    }

    resolve(data)
  })
}

function getSlotMap({
  pushTarget,
  warnRule,
  warnTemplate,
}: {
  pushTarget?: Array<Record<string, any>>
  warnRule?: Array<Record<string, any>>
  warnTemplate?: Array<Record<string, any>>
} = {}) {
  return {
    push_target: () => h(PushTarget, { initData: pushTarget }),
    warn_rule: () => h(WarnRule, { initData: warnRule }),
    warn_template: () => h(WarnTemplate, { initData: warnTemplate }),
  }
}

const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/warnPushCfg',
      permission: 'yq:warnPushCfg:remove',
    },
    list: {
      method: 'yq/warnPushCfg/list',
    },
  },
  columns: [
    {
      colKey: 'name',
      title: '预警推送名称',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'warn_range',
      },
      colKey: 'range',
      title: '预警范围',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'push_type',
      },
      colKey: 'pushType',
      title: '推送类型',
    },
    {
      colKey: 'pushFrequency',
      title: '推送频率',
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
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      colKey: 'createBy',
      title: '创建人',
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
                    ignoreKeys: ['warnTemplate', 'warnRule', 'pushTarget'],
                    numberToStringKeys: ['status', 'pushType', 'range'],
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
                      data: reactive({
                        range: String(row.range),
                      }),
                      items: [
                        formItemMap.name,
                        formItemMap.range,
                        formItemMap.brandId,
                        formItemMap.taskId,
                        formItemMap.pushType,
                        formItemMap.pushFrequency,
                        formItemMap.status,
                        formItemMap.warn_rule,
                        formItemMap.push_target,
                        formItemMap.warn_template,
                      ],
                      ref: formRef,
                    },
                    getSlotMap({
                      pushTarget: row.pushTarget,
                      warnRule: row.warnRule,
                      warnTemplate: row.warnTemplate,
                    }),
                  ),
                header: '修改预警推送配置',
                onConfirmCallback: async () => {
                  const data = await getSaveData(await formRef.value!.validate())

                  await alovaInst.Put('yq/warnPushCfg', {
                    ...data,
                    id: row.id,
                  })
                  $msg.success('预警推送配置修改成功')
                  pageListRef.value!.query()
                },
                width: 1050,
              })
            },
            permission: 'yq:warnPushCfg:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.name,
    formItemMap.range,
    formItemMap.pushType,
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
            h(
              TForm,
              {
                data: reactive({
                  status: '0',
                }),
                items: [
                  formItemMap.name,
                  formItemMap.range,
                  formItemMap.brandId,
                  formItemMap.taskId,
                  formItemMap.pushType,
                  formItemMap.pushFrequency,
                  formItemMap.status,
                  formItemMap.warn_rule,
                  formItemMap.push_target,
                  formItemMap.warn_template,
                ],
                ref: formRef,
              },
              getSlotMap(),
            ),
          header: '新增预警推送配置',
          onConfirmCallback: async () => {
            const data = await getSaveData(await formRef.value!.validate())

            await alovaInst.Post('yq/warnPushCfg', data)
            $msg.success('预警推送配置新增成功')
            pageListRef.value!.query()
          },
          width: 1050,
        })
      },
      permission: 'yq:warnPushCfg:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
