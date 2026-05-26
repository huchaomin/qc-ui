<script setup lang="ts">
import ExtraCfgList from '@/views/eventMgr/eventList/eventDetail/modules/modules/ExtraCfgList.vue'
import Details from './modules/Details.vue'

const formItemMap = {
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  extraType: {
    _label: '抽帧类型',
    component: 'TSelect',
    dicCode: 'extra_type',
    model: 'extraType',
  },
  status: {
    _label: '状态',
    component: 'TSelect',
    dicCode: 'extra_record_status',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    export: {
      method: 'yq/frameExtraRecord/export',
      permission: 'yq:frameExtraRecord:export',
    },
    list: {
      method: 'yq/frameExtraRecord/list',
    },
  },
  columns: [
    {
      cell: {
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌',
    },
    {
      colKey: 'eventId',
      title: '事件编号',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_type',
      },
      colKey: 'extraType',
      title: '抽帧类型',
    },
    {
      cell: (_, { row }) => {
        if (row.extraNumType === 1) {
          return {
            _component: 'DicLabel',
            dicCode: 'extra_num_type',
          }
        } else if (row.extraNumType === 2) {
          return {
            _component: 'Link',
            default: useDicLabel('extra_num_type', row.extraNumType).value,
            onClick: () => {
              void $confirm({
                body: () =>
                  h(ExtraCfgList, {
                    initialData: row.extraNumCfg,
                    type: 'view',
                  }),
                confirmBtn: null,
                header: '抽帧数量配置',
                width: 730,
              })
            },
          }
        } else {
          return {
            _component: 'Default',
          }
        }
      },
      colKey: 'extraNumType',
      title: '抽帧数量配置',
    },
    {
      colKey: 'extraNum',
      title: '固定帧数',
    },
    {
      colKey: 'successNum',
      title: '成功数量',
    },
    {
      colKey: 'failNum',
      title: '失败数量',
    },
    {
      colKey: 'totalExtraNum',
      title: '总抽取帧数',
    },
    {
      align: 'right',
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'prePoints',
      title: '预扣积分',
    },
    {
      align: 'right',
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'actualPoints',
      title: '实扣积分',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_record_status',
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
      title: '创建日期',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      colKey: 'updateTime',
      title: '更新日期',
    },
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '详情',
            onClick: () => {
              void $confirm({
                body: () =>
                  h(Details, {
                    recordId: row.id,
                  }),
                cancelBtn: '关闭',
                confirmBtn: null,
                header: '抽帧详情',
                width: 1080,
              })
            },
            permission: 'yq:frameExtraDetail:list',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [formItemMap.brandId, formItemMap.extraType, formItemMap.status],
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
