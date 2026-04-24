<script setup lang="ts">
const formItemMap = {
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  publishTime: {
    _label: '发布时间',
    component: 'TDateRangePicker',
    model: 'publishTime',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/labelBatch',
      permission: 'yq:labelBatch:remove',
    },
    export: {
      method: 'yq/labelBatch/export',
      permission: 'yq:labelBatch:export',
    },
    list: {
      method: (o: Record<string, any>) =>
        alovaInst.Get('yq/labelBatch/list', {
          params: {
            ...o,
            endPublishTime: o.publishTime[0] ?? '',
            publishTime: undefined,
            startPublishTime: o.publishTime[1] ?? '',
          },
        }),
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
      colKey: 'totalCount',
      title: '批次内总条数',
    },
    {
      colKey: 'unlabeledCount',
      title: '未打标条数',
    },
    {
      colKey: 'dictLabeledCount',
      title: '字典标签已写入条数',
    },
    {
      colKey: 'distinctCategoryCount',
      title: '去重后的类别数量',
    },
    {
      colKey: 'secondLayerLabeledCount',
      title: '第二层规则聚类完成条数',
    },
    {
      colKey: 'qualityScore',
      title: '聚类质量评分',
    },
    {
      colKey: 'errorMsg',
      title: '失败原因',
    },
    {
      colKey: 'publishTimeStart',
      title: '开始发布时间',
    },
    {
      colKey: 'publishTimeEnd',
      title: '结束发布时间',
    },
    {
      colKey: 'statDate',
      title: '统计日',
    },
    {
      colKey: 'statsFinishedTime',
      title: '统计完成时间',
    },
    {
      colKey: 'tagListJson',
      resize: {
        maxWidth: 300,
      },
      title: '去重标签清单JSON',
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
  formItems: [formItemMap.brandId, formItemMap.publishTime],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
