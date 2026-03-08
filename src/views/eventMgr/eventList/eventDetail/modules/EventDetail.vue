<script setup lang="ts">
import { addFollow, updateDealMark, warnByHand } from '@/bus'

const router = useRouter()
const pageListRef = useTemplateRef('pageListRef')
const selectedRows = computed(() => pageListRef.value?.selectedRows ?? [])
const id = inject<string>('id')!
const formItemMap = {
  authorName: {
    _label: '发布账号',
    model: 'authorName',
  },
  contentEmotion: {
    _label: '内容情绪',
    component: 'TSelect',
    dicCode: 'mood_level',
    model: 'contentEmotion',
  },
  contentType: {
    _label: '内容类型',
    component: 'TSelect',
    dicCode: 'data_type',
    model: 'contentType',
  },
  eventHitCount: {
    _label: '事件命中次数',
    component: 'TRangeInput',
    model: 'eventHitCount',
  },
  eventHitField: {
    _label: '事件命中字段',
    model: 'eventHitField',
  },
  eventHitReason: {
    _label: '事件命中原因',
    model: 'eventHitReason',
  },
  negativeCommentCount: {
    _label: '负面评论数',
    component: 'TRangeInput',
    model: 'negativeCommentCount',
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
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('yq/eventDetail/list', {
          params: {
            ...o,
            eventHitCount: undefined,
            eventHitCountMax: o.eventHitCount?.[1],
            eventHitCountMin: o.eventHitCount?.[0],
            eventId: id,
            negativeCommentCount: undefined,
            negativeCommentCountMax: o.negativeCommentCount?.[1],
            negativeCommentCountMin: o.negativeCommentCount?.[0],
            publishTime: undefined,
            publishTimeEnd:
              o.publishTime?.[1] !== undefined
                ? dayjs(o.publishTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
            publishTimeStart:
              o.publishTime?.[0] !== undefined
                ? dayjs(o.publishTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
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
      colKey: 'platform',
      title: '来源',
    },
    useAuthorNameColumn(),
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'mood_level',
      },
      colKey: 'contentEmotion', // TODO
      title: '内容情绪',
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
      colKey: 'playCount',
      title: '播放量',
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
      colKey: 'negativeCommentCount',
      title: '负面评论数',
    },
    {
      colKey: 'videoContent',
      resize: {
        maxWidth: 300,
      },
      title: '视频内容',
    },
    {
      colKey: 'eventHitField',
      title: '事件命中字段',
    },
    {
      colKey: 'eventHitReason',
      title: '事件命中原因',
    },
    {
      colKey: 'eventHitCount',
      title: '事件命中次数',
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
    formItemMap.platform,
    formItemMap.publishTime,
    formItemMap.authorName,
    formItemMap.title,
    formItemMap.contentEmotion,
    formItemMap.negativeCommentCount,
    formItemMap.eventHitField,
    formItemMap.eventHitReason,
    formItemMap.eventHitCount,
  ],
  operations: [
    {
      default: '导出内容(旧)',
      permission: 'yq:eventDetail:export',
      popconfirm: {
        content: '确认要导出视频吗?',
        onConfirm: async () => {
          await alovaInst.Post('yq/eventDetail/export', pageListRef.value!.queryParams, {
            meta: {
              useDownload: `事件视频详情_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
              useEmptyData: true,
            },
          })
        },
      },
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
  ],
  tableOtherProps: {
    flexHeight: false,
    showRowSelect: 'multiple',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
