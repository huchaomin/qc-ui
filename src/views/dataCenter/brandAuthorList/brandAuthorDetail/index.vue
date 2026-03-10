<script setup lang="ts">
import AuthorName from '@/bus/components/AuthorName.vue'
import Weight from './modules/Weight.vue'

const route = useRoute()
const id = route.query.id as string | undefined
const authorCode = route.query.authorCode as string | undefined
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  accName: {
    _class: 'col-span-3',
    _label: '账号ID',
    model: 'accName',
  },
  authProfession: {
    _label: '作者类型',
    model: 'authProfession',
  },
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  fansCount: {
    _label: '粉丝数量',
    model: 'fansCount',
  },
  ipAddress: {
    _label: 'IP地址',
    model: 'ipAddress',
  },
  listId: {
    __others: (formData: Record<string, any>) => {
      return {
        onChange: () => {
          formData.weight = ''
        },
      }
    },
    _label: '品牌作者名单',
    _required: true,
    component: 'TSelect',
    model: 'listId',
    options: 'name',
  },
  nick_name: {
    _label: '账号名称',
    _required: true,
    model: 'nickName',
    slot: 'nick_name',
  },
  nickName: {
    _label: '账号名称',
    model: 'nickName',
  },
  platform: {
    _label: '平台',
    _required: true,
    model: 'platform',
  },
  type: {
    _label: '名单分类',
    component: 'TSelect',
    dicCode: 'name_type',
    model: 'type',
  },
  weight: {
    _label: '权重',
    _required: true,
    model: 'weight',
    slot: 'weight',
  },
} satisfies Record<string, FormItem>

function getSlotMap(nickName: string = '') {
  return {
    nick_name: () =>
      h(AuthorName, {
        defaultInputValue: nickName,
        onChange: (
          value: null | { id: null | string; label: string; value: string },
          formData: Record<string, any>,
        ) => {
          formData.accName = value?.value ?? ''
          formData.nickName = value?.label ?? ''
        },
      }),
    weight: () => h(Weight),
  }
}

const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/nameListDetail',
      permission: 'yq:nameListDetail:remove',
      showBatch: true,
    },
    export: {
      method: 'yq/nameListDetail/export',
      permission: 'yq:nameListDetail:export',
    },
    list: {
      method: 'yq/nameListDetail/list',
    },
  },
  columns: [
    {
      cell: {
        _component: 'OptionLabel',
        options: 'name',
      },
      colKey: 'listId',
      title: '品牌作者名单',
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
      colKey: 'platform',
      title: '平台',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'name_type',
      },
      colKey: 'type',
      title: '名单分类',
    },
    {
      colKey: 'nickName',
      title: '账号名称',
    },
    {
      colKey: 'weight',
      title: '权重',
    },
    {
      colKey: 'negativeContentCount',
      title: '负面内容数',
    },
    {
      colKey: 'positiveContentCount',
      title: '正面内容数',
    },
    {
      colKey: 'neutralContentCount',
      title: '中性内容数',
    },
    {
      colKey: 'ipAddress',
      title: 'IP地址',
    },
    {
      colKey: 'fansCount',
      title: '粉丝数量',
    },
    {
      colKey: 'authProfession',
      title: '作者类型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'author_type',
      },
      colKey: 'authorType',
      title: '认证类型',
    },
    {
      colKey: 'authorId',
      title: '作者ID',
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
                  h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      data: reactive({
                        accName: row.accName,
                      }),
                      items: [
                        formItemMap.listId,
                        formItemMap.nick_name,
                        formItemMap.platform,
                        formItemMap.weight,
                      ],
                      ref: formRef,
                    },
                    getSlotMap(row.nickName),
                  ),
                header: '修改名单作者',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/nameListDetail', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('名单作者修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
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
    formItemMap.listId,
    formItemMap.brandId,
    formItemMap.platform,
    formItemMap.type,
    formItemMap.nickName,
    formItemMap.accName,
  ],
  initialFormData: {
    accName: authorCode ?? '',
    listId: id ?? '',
  },
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
                items: [
                  formItemMap.listId,
                  formItemMap.nick_name,
                  formItemMap.platform,
                  formItemMap.weight,
                ],
                ref: formRef,
              },
              getSlotMap(),
            ),
          header: '添加名单作者',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/nameListDetail', await formRef.value!.validate())
            $msg.success('名单作者添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:nameListDetail:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
