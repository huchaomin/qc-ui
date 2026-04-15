<script setup lang="ts">
import type { SortInfo } from 'tdesign-vue-next'
import { addFollow, updateDealMark, warnByHand } from '@/bus'
import AddVideoManual from './AddVideoManual.vue'

const router = useRouter()
const pageListRef = useTemplateRef('pageListRef')
const selectedRows = computed(() => pageListRef.value?.selectedRows ?? [])
const finallyQueryParams = computed(() => pageListRef.value?.finallyQueryParams)
const id = inject<string>('id')!
const sort = ref<SortInfo | undefined>({
  descending: true,
  sortBy: 'publishTime',
})
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
    _label: '内容实体关联',
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
    _label: '处理状态',
    component: 'TSelect',
    dicCode: 'deal_mark',
    model: 'dealMark',
  },
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
  negativeCommentNum: {
    _label: '评论负面数',
    component: 'TRangeInput',
    model: 'negativeCommentNum',
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
            ...(sort.value
              ? {
                  isAsc: sort.value!.descending ? 'desc' : 'asc',
                  orderByColumn: `t.${_snakeCase(sort.value!.sortBy)}`,
                }
              : {}),
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
    useVideoTitleColumn({
      funType: 1,
    }),
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
      title: '处理状态',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'wx_platform',
      },
      colKey: 'platform',
      title: '平台',
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
      colKey: 'publishTime',
      sorter: true,
      title: '发布时间',
    },
    {
      colKey: 'createTime',
      sorter: true,
      title: '创建时间',
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
      title: '内容实体关联',
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
            default: '详情',
            onClick: () => {
              const url = router.resolve({
                name: 'VideoDetail',
                query: {
                  id: row.bciId,
                },
              })

              window.open(url.href, '_blank')
            },
            show: router.hasRoute('VideoDetail'),
          }),
          ({ row }) => ({
            default: '手工预警',
            onClick: () => {
              warnByHand(row)
            },
            permission: 'data:brandContentInfo:warnByHand',
          }),
          ({ row }) => ({
            default: '标记',
            onClick: () => {
              updateDealMark([row]).then(() => {
                pageListRef.value!.query()
              })
            },
            permission: 'task:taskContent:updateDealMark',
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
    formItemMap.negativeCommentNum,
    formItemMap.downloadStatus,
    formItemMap.transWordStatus,
    formItemMap.analysisStatus,
    formItemMap.dealMark,
    formItemMap.coreViewpoints,
    formItemMap.brandProduct,
  ],
  initialFormData: reactive({
    publishTime: [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  }),
  operations: [
    {
      default: '手动添加视频',
      onClick: () => {
        const addVideoManualRef = ref<InstanceType<typeof AddVideoManual> | null>(null)

        void $confirm({
          body: () =>
            h(AddVideoManual, {
              ref: addVideoManualRef,
              taskId: id,
            }),
          confirmBtn: checkPermissions('task:taskContent:handSearchSave') ? undefined : null,
          header: '手动添加视频',
          onConfirmCallback: async () => {
            await addVideoManualRef.value!.handleSubmit()
            pageListRef.value!.query()
          },
          width: 1200, // 730
        })
      },
      permission: 'task:taskContent:handSearch',
    },
    reactive({
      default: '加入关注',
      disabled: computed(() => selectedRows.value.length === 0),
      onClick: () => {
        addFollow(selectedRows.value)
      },
      permission: 'yq:followDetail:add',
    }),
    reactive({
      default: '批量标记',
      disabled: computed(() => selectedRows.value.length === 0),
      onClick: () => {
        updateDealMark(selectedRows.value).then(() => {
          pageListRef.value!.query()
        })
      },
      permission: 'task:taskContent:updateDealMark',
    }),
    reactive({
      default: '导出',
      disabled: computed(() => finallyQueryParams.value === undefined),
      permission: 'task:taskContent:taskVideExport',
      popconfirm: {
        content: '确定导出吗?',
        onConfirm: async () => {
          const data = {
            ...finallyQueryParams.value,
          }

          if (selectedRows.value.length > 0) {
            data.ids = selectedRows.value.map((item) => item.id).join(',')
          }

          await alovaInst.Post('task/taskContent/taskVideExport', data, {
            meta: {
              useDownload: `任务详情_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
              useFormData: true,
              useResponseBlob: true,
            },
          })
        },
      },
    }),
  ],
  tableOtherProps: reactive({
    flexHeight: false,
    onSortChange: (val: SortInfo | SortInfo[]) => {
      sort.value = val as SortInfo
      pageListRef.value!.query()
    },
    showRowSelect: 'multiple' as const,
    sort,
  }),
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
