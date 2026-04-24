<script setup lang="ts">
import { clusterTypeList, clusterTypeListSend } from '../clusterTypeMgr/utils'

const route = useRoute()
const pageListRef = useTemplateRef('pageListRef')
const currentQueryParams = computed(() => pageListRef.value?.currentQueryParams)

nextTick(() => {
  currentQueryParams.value!.typeId = (route.query.typeId as string) ?? ''
  pageListRef.value!.query()
})
onActivated(() => {
  clusterTypeListSend()
})

const formItemMap = {
  categoryCode: {
    _label: '分类编码',
    _required: true,
    model: 'categoryCode',
  },
  categoryDesc: {
    _class: 'col-span-full',
    _label: '分类描述',
    model: 'categoryDesc',
  },
  categoryName: {
    _label: '分类名称',
    _required: true,
    model: 'categoryName',
  },
  sortOrder: {
    _label: '排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'sortOrder',
    theme: 'row',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  typeId: reactive({
    _label: '聚类类型',
    _required: true,
    component: 'TSelect',
    model: 'typeId',
    options: clusterTypeList,
  }),
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/clusterCategory',
      permission: 'yq:clusterCategory:remove',
    },
    export: {
      method: 'yq/clusterCategory/export',
      permission: 'yq:clusterCategory:export',
    },
    list: {
      method: 'yq/clusterCategory/list',
    },
  },
  columns: [
    {
      colKey: 'categoryCode',
      title: '分类编码',
    },
    {
      colKey: 'categoryName',
      title: '分类名称',
    },
    {
      colKey: 'categoryDesc',
      title: '分类描述',
    },
    {
      colKey: 'sortOrder',
      title: '排序',
    },
    {
      cell: () => {
        return {
          _component: 'OptionLabel',
          options: clusterTypeList.value,
        }
      },
      colKey: 'typeId',
      title: '聚类类型',
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
                  h(TForm, {
                    items: [
                      {
                        ...formItemMap.categoryCode,
                        disabled: true,
                      },
                      formItemMap.categoryName,
                      formItemMap.typeId,
                      formItemMap.categoryDesc,
                      formItemMap.sortOrder,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                    ],
                    ref: formRef,
                  }),
                header: '修改聚类分类',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/clusterCategory', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('聚类分类修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:clusterCategory:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.categoryCode,
    formItemMap.categoryName,
    formItemMap.typeId,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
  ],
  isFirstQueryByParent: true,
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(TForm, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.categoryCode,
                formItemMap.categoryName,
                formItemMap.typeId,
                formItemMap.categoryDesc,
                formItemMap.sortOrder,
                {
                  ...formItemMap.status,
                  component: 'TRadioGroup',
                },
              ],
              ref: formRef,
            }),
          header: '新增聚类分类',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/clusterCategory', await formRef.value!.validate())
            $msg.success('聚类分类新增成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:clusterCategory:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
