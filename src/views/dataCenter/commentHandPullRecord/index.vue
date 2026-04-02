<script setup lang="ts">
const router = useRouter()
const formItemMap = {
  funcType: {
    _label: '功能类型',
    component: 'TSelect',
    dicCode: 'func_type',
    model: 'funcType',
  },
  status: {
    _label: '状态',
    component: 'TSelect',
    dicCode: 'pull_status',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/commentHandPullRecord',
      permission: 'yq:commentHandPullRecord:remove',
    },
    list: {
      method: 'yq/commentHandPullRecord/list',
    },
  },
  columns: [
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'func_type',
      },
      colKey: 'funcType',
      title: '功能类型',
    },
    {
      cell: (_, { row }) => {
        const { funcId, funcType } = row
        let routeName = ''

        if (funcType === 2 && router.hasRoute('FollowDetail')) {
          routeName = 'FollowDetail'
        }

        if (funcType === 3 && router.hasRoute('EventDetail')) {
          routeName = 'EventDetail'
        }

        if (routeName !== '') {
          return {
            _component: 'Link',
            onClick: () => {
              router.push({
                name: routeName,
                query: {
                  id: funcId,
                },
              })
            },
          }
        }

        return {
          _component: 'Default',
        }
      },
      colKey: 'funcId',
      title: '功能id',
    },
    {
      colKey: 'contentIds',
      title: '内容id列表',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'pull_status',
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
  ],
  formItems: [formItemMap.funcType, formItemMap.status],
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
