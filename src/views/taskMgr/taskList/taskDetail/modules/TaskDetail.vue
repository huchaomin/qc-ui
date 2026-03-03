<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const id = inject<string>('id')!
// formItems: [
//   {
//     model: 'contentType',
//     props: {
//       label: '内容类型',
//       options: $dicStore('data_type'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'publishTime',
//     props: {
//       label: '发布时间',
//       type: 'daterange',
//       shortcuts: 'daterange',
//       class: 'span_2',
//     },
//     component: 'CDate',
//   },
//   {
//     model: 'authorName',
//     props: {
//       label: '发布账号',
//     },
//   },
//   {
//     model: 'platform',
//     props: {
//       label: '来源',
//     },
//   },
//   {
//     model: 'title',
//     props: {
//       label: '标题',
//     },
//   },
//   {
//     model: 'moodLevel',
//     props: {
//       label: '内容情绪',
//       options: $dicStore('mood_level'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'negativeCommentNum',
//     props: {
//       label: '评论负面数',
//       placeholder: ['最小值', '最大值'],
//     },
//     component: 'MinMax',
//   },
//   {
//     model: 'downloadStatus',
//     props: {
//       label: '下载状态',
//       options: $dicStore('download_status'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'transWordStatus',
//     props: {
//       label: '转换状态',
//       options: $dicStore('trans_word_status'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'analysisStatus',
//     props: {
//       label: '分析状态',
//       options: $dicStore('analysis_status'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'dealMark',
//     props: {
//       label: '处理标记',
//       options: $dicStore('deal_mark'),
//     },
//     component: 'CSelect',
//   },
//   {
//     model: 'coreViewpoints',
//     props: {
//       label: '核心观点',
//     },
//   },
//   {
//     model: 'brandProduct',
//     props: {
//       label: '内容品牌',
//     },
//   },
// ],
const formItemMap = {
  analysisStatus: {
    _label: '分析状态',
    component: 'TSelect',
    dicCode: 'analysis_status',
    model: 'analysisStatus',
  },
  authorName: {
    _label: '发布账号',
    model: 'authorName',
  },
  brandProduct: {
    _label: '内容品牌',
    model: 'brandProduct',
  },
  contentType: {
    _label: '内容类型',
    component: 'TSelect',
    dicCode: 'data_type',
    model: 'contentType',
  },
  coreViewpoints: {
    _label: '核心观点',
    model: 'coreViewpoints',
  },
  dealMark: {
    _label: '处理标记',
    component: 'TSelect',
    dicCode: 'deal_mark',
    model: 'dealMark',
  },
  // negativeCommentNum: {
  //   _label: '评论负面数',
  //   component: 'MinMax',
  //   model: 'negativeCommentNum',
  // },
  downloadStatus: {
    _label: '下载状态',
    component: 'TSelect',
    dicCode: 'download_status',
    model: 'downloadStatus',
  },
  moodLevel: {
    _label: '内容情绪',
    component: 'TSelect',
    dicCode: 'mood_level',
    model: 'moodLevel',
  },
  platform: {
    _label: '来源',
    model: 'platform',
  },
  publishTime: {
    _class: 'col-span-2',
    _label: '发布时间',
    component: 'TDateRangePicker',
    model: 'publishTime',
  },
  title: {
    _label: '标题',
    model: 'title',
  },
  transWordStatus: {
    _label: '转换状态',
    component: 'TSelect',
    dicCode: 'trans_word_status',
    model: 'transWordStatus',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('task/taskContent/taskContentPage', {
          params: {
            ...o,
            endTime:
              o.publishTime?.[1] !== undefined
                ? dayjs(o.publishTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
            negativeCommentNum: undefined,
            negativeCommentNumGe: o.negativeCommentNum?.[0],
            negativeCommentNumLe: o.negativeCommentNum?.[1],
            publishTime: undefined,
            startTime:
              o.publishTime?.[0] !== undefined
                ? dayjs(o.publishTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
            taskId: id,
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    useVideoTitleColumn(),
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'data_type',
      },
      colKey: 'contentType',
      title: '内容类型',
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
      colKey: 'platform',
      title: '来源',
    },
    useAuthorNameColumn(),
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'mood_level',
      },
      colKey: 'moodLevel',
      title: '内容情绪',
    },
    {
      colKey: 'moodScore',
      title: '情绪级别',
    },
    {
      colKey: 'coreViewpoints',
      resize: {
        maxWidth: 300,
      },
      title: '核心观点',
    },
    {
      cell: {
        _component: 'FormatDate',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      colKey: 'publishTime',
      title: '发布时间',
    },
    {
      colKey: 'searchWords',
      resize: {
        maxWidth: 300,
      },
      title: '搜索词',
    },
    {
      colKey: 'brandProduct',
      title: '内容品牌',
    },
    {
      align: 'right',
      colKey: 'commentCount',
      title: '评论数',
    },
    {
      align: 'right',
      colKey: 'likeCount',
      title: '喜欢/点赞',
    },
    {
      align: 'right',
      colKey: 'hotCount',
      title: '累计热度',
    },
    {
      align: 'right',
      colKey: 'hotCountNew',
      title: '今日热度',
    },

    {
      align: 'right',
      colKey: 'negativeCommentNum',
      title: '负面评论数',
    },

    {
      colKey: 'coreWord',
      title: '内容关键词',
    },

    {
      cell: {
        _component: 'FormatDate',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      colKey: 'updateTime',
      title: '更新时间',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'download_status',
      },
      colKey: 'downloadStatus',
      title: '下载状态',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'trans_word_status',
      },
      colKey: 'transWordStatus',
      title: '转换状态',
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
      cell: {
        _component: 'DicLabel',
        dicCode: 'author_type',
      },
      colKey: 'authorType',
      title: '作者标签',
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
                      formItemMap.dictType,
                      formItemMap.dictLabel,
                      formItemMap.dictValue,
                      formItemMap.dictSort,
                      formItemMap.status,
                      formItemMap.remark,
                    ],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改字典数据',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/dict/data', {
                    ...(await formRef.value!.validate()),
                    dictCode: row.dictCode,
                  })
                  $msg.success('字典数据修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
            permission: 'system:dict:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.contentType,
    formItemMap.publishTime,
    formItemMap.authorName,
    formItemMap.platform,
    formItemMap.title,
    formItemMap.moodLevel,
    formItemMap.downloadStatus,
    formItemMap.transWordStatus,
    formItemMap.analysisStatus,
    formItemMap.dealMark,
    formItemMap.coreViewpoints,
    formItemMap.brandProduct,
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
                dictType: props.dictType,
                status: '0',
              }),
              items: [
                formItemMap.dictType,
                formItemMap.dictLabel,
                formItemMap.dictValue,
                formItemMap.dictSort,
                formItemMap.status,
                formItemMap.remark,
              ],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加字典数据',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/data', await formRef.value!.validate())
            $msg.success('字典数据添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'system:dict:add',
    },
  ],
  tableOtherProps: {
    flexHeight: false,
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
