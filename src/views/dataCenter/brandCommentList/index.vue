<script setup lang="ts">
const formItemMap = {
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  moodLevel: {
    _label: '情绪等级',
    component: 'TSelect',
    dicCode: 'mood_level',
    model: 'moodLevel',
  },
  publishTime: {
    _class: 'col-span-2',
    _label: '发布时间',
    component: 'TDateRangePicker',
    model: 'publishTime',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    export: {
      method: 'data/brandCommentInfo/export',
      permission: 'data:brandCommentInfo:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('data/brandCommentInfo/list', {
          params: {
            ...o,
            endTime:
              o.publishTime?.[1] !== undefined
                ? dayjs(o.publishTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
            publishTime: undefined,
            startTime:
              o.publishTime?.[0] !== undefined
                ? dayjs(o.publishTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
          },
        })
      },
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
      colKey: 'content',
      resize: {
        maxWidth: 300,
      },
      title: '评论内容',
    },
    {
      colKey: 'contentId',
      title: '视频id',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'analysis_status',
      },
      colKey: 'analysisStatus',
      title: '分析状态',
    },
    {
      colKey: 'analysisModel',
      title: '分析模型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'mood_level',
      },
      colKey: 'moodLevel',
      title: '情绪等级',
    },
    {
      colKey: 'viewpointType',
      title: '观点分类',
    },
    {
      colKey: 'coreWord',
      title: '关键词',
    },
    {
      colKey: 'errorNum',
      title: '错误次数',
    },
    {
      colKey: 'errorMsg',
      resize: {
        maxWidth: 300,
      },
      title: '错误原因',
    },
    {
      colKey: 'expandCommentCount',
      title: '回复数量',
    },
    {
      colKey: 'author',
      title: '评论人',
    },
    {
      cell: {
        _component: 'Avatar',
      },
      colKey: 'headUrl',
      title: '头像',
    },
    {
      colKey: 'likeCount',
      title: '点赞数量',
    },
    {
      colKey: 'replyCommentId',
      title: '回复评论id',
    },
    {
      colKey: 'publishTime',
      title: '发布时间',
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
  formItems: [formItemMap.brandId, formItemMap.moodLevel, formItemMap.publishTime],
  initialFormData: {
    publishTime: [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
