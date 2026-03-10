<script setup lang="ts">
// import ContentSlice from './videoDetail/modules/ContentSlice.vue'

const pageListRef = useTemplateRef('pageListRef')
const brandOptions = useList('brand')

watch(
  () => brandOptions.value[0]?.value,
  (brandId) => {
    if (brandId) {
      nextTick(() => {
        pageListRef.value!.query()
      })
    }
  },
)

const formItemMap = {
  analysisModel: {
    _label: '分析模型id',
    model: 'analysisModel',
  },
  analysisStatus: {
    _label: '分析状态',
    component: 'TSelect',
    dicCode: 'analysis_status',
    model: 'analysisStatus',
  },
  authorName: {
    _label: '作者名称',
    model: 'authorName',
  },
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  dealMark: {
    _label: '处理标记',
    component: 'TSelect',
    dicCode: 'deal_mark',
    model: 'dealMark',
  },
  markModel: {
    _label: '打标模型id',
    model: 'markModel',
  },
  moodLevel: {
    _label: '情绪等级',
    component: 'TSelect',
    dicCode: 'mood_level',
    model: 'moodLevel',
  },
  moodScore: {
    _label: '情绪评分0-10分',
    component: 'TInputNumber',
    decimalPlaces: 0,
    max: 10,
    model: 'moodScore',
  },
  platform: {
    _label: '来源',
    model: 'platform',
  },
  publishTime: {
    _label: '发布时间',
    component: 'TDateRangePicker',
    model: 'publishTime',
  },
  relationType: {
    _label: '品牌产品关联类型',
    component: 'TSelect',
    dicCode: 'product_relate_type',
    model: 'relationType',
  },
  text: {
    _label: '图文内容',
    model: 'text',
  },
  title: {
    _label: '标题',
    model: 'title',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'data/brandContentInfo',
      permission: 'data:brandContentInfo:remove',
    },
    export: {
      method: 'data/brandContentInfo/export',
      permission: 'data:brandContentInfo:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('data/brandContentInfo/list', {
          params: {
            ...o,
            contentType: '2',
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
    useVideoTitleColumn({
      bciIdKey: 'id',
    }),
    {
      colKey: 'contentText',
      resize: {
        maxWidth: 300,
      },
      title: '图文内容',
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
      title: '来源',
    },
    useAuthorNameColumn(),
    {
      colKey: 'publishTime',
      title: '发布时间',
    },
    {
      cell: (_, { row }) => {
        return {
          _component: 'Link',
          default: '点击查看',
          onClick: async () => {
            const data = await alovaInst.Get<Record<string, any>>(
              `data/contentInfo/${row.contentId}`,
            )

            void $confirm({
              body: () =>
                h(ContentSlice, {
                  bodyClassName: 'p-0!',
                  data,
                  headerBordered: false,
                  'onUpdate:originalUrl': () => {
                    pageListRef.value!.query()
                  },
                  shadow: false,
                  title: undefined,
                }),
              header: '内容切片总结',
              width: 1400,
            })
          },
        }
      },
      colKey: 'aiContent',
      title: '内容切片',
    },
    {
      colKey: 'commentCount',
      title: '评论量',
    },
    {
      colKey: 'forwardCount',
      title: '转发数',
    },
    {
      colKey: 'interactNum',
      title: '互动量',
    },
    {
      colKey: 'contentLabel',
      resize: {
        maxWidth: 300,
      },
      title: '内容标签',
    },
    {
      colKey: 'city',
      title: '城市',
    },
    {
      colKey: 'province',
      title: '省',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'author_type',
      },
      colKey: 'authorType',
      title: '作者类型',
    },
    {
      colKey: 'searchWords',
      resize: {
        maxWidth: 300,
      },
      title: '搜索词',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'video_label',
      },
      colKey: 'timeLabel',
      title: '图文标签',
    },
    {
      colKey: 'priority',
      title: '分析优先级',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'deal_mark',
      },
      colKey: 'dealMark',
      title: '处理标记',
    },
    {
      colKey: 'markModel',
      title: '打标模型id',
    },
    {
      colKey: 'titleCheckResult',
      resize: {
        maxWidth: 300,
      },
      title: '标题相关判断结果',
    },
    {
      colKey: 'titleCheckReason',
      resize: {
        maxWidth: 300,
      },
      title: '标题相关判断原因',
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
      title: '分析模型id',
    },
    {
      colKey: 'moodReason',
      resize: {
        maxWidth: 300,
      },
      title: '情绪分析原因',
    },
    {
      colKey: 'moodScore',
      title: '情绪评分0-10分',
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
      colKey: 'authorIntention',
      resize: {
        maxWidth: 300,
      },
      title: '作者意图',
    },
    {
      colKey: 'coreWord',
      resize: {
        maxWidth: 300,
      },
      title: '关键词',
    },
    {
      colKey: 'coreViewpoints',
      resize: {
        maxWidth: 300,
      },
      title: '核心观点',
    },
    {
      colKey: 'brandProduct',
      resize: {
        maxWidth: 300,
      },
      title: '品牌产品分析',
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
  formItems: [
    formItemMap.title,
    formItemMap.text,
    formItemMap.brandId,
    formItemMap.platform,
    formItemMap.authorName,
    formItemMap.dealMark,
    formItemMap.relationType,
    formItemMap.publishTime,
    formItemMap.markModel,
    formItemMap.analysisStatus,
    formItemMap.analysisModel,
    formItemMap.moodScore,
    formItemMap.moodLevel,
  ],
  initialFormData: reactive({
    brandId: computed(() => brandOptions.value[0]?.value),
    publishTime: [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  }),
  isFirstQueryByParent: true,
  tableOtherProps: {
    rowKey: 'id',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
