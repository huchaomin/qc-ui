<script setup lang="ts">
import type { Ref } from 'vue'
import { fillOriginalUrl, handPullComments } from '@/bus'

const id = inject<string>('id')!
const data = inject<Ref<Record<string, any> | undefined>>('data')!
const pageListRef = useTemplateRef('pageListRef')
const selectedRows = computed(() => pageListRef.value?.selectedRows ?? [])
const finallyQueryParams = computed(() => pageListRef.value?.finallyQueryParams)
const formItemMap = {
  authorName: {
    _label: '作者',
    model: 'authorName',
  },
  contentType: {
    _label: '内容类型',
    component: 'TSelect',
    dicCode: 'data_type',
    model: 'contentType',
  },
  moodLevel: {
    _label: '内容情绪',
    component: 'TSelect',
    dicCode: 'mood_level',
    model: 'moodLevel',
  },
  platform: {
    _label: '平台',
    model: 'platform',
  },
  publishTime: {
    _class: 'col-span-2',
    _label: '发布时间',
    component: 'TDateRangePicker',
    enableTimePicker: true,
    model: 'publishTime',
  },
  title: {
    _label: '标题',
    model: 'title',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/followDetail',
      permission: 'yq:followDetail:remove',
      showBatch: true,
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('yq/followDetail/list', {
          params: {
            ...o,
            endTime:
              o.publishTime?.[1] !== undefined
                ? dayjs(o.publishTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                : '',
            followId: id,
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
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    useVideoTitleColumn({
      funType: 2,
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
        dicCode: 'wx_platform',
      },
      colKey: 'platform',
      title: '平台',
    },
    {
      colKey: 'publishTime',
      title: '发布时间',
    },
    useAuthorNameColumn(),
    {
      colKey: 'commentCount',
      title: '评论数',
    },
    {
      colKey: 'favCount',
      title: '点赞数',
    },
    {
      colKey: 'forwardCount',
      title: '转发数',
    },
    {
      colKey: 'likeCount',
      title: '喜欢数',
    },
    {
      colKey: 'interactNum',
      title: '互动数',
    },
    {
      colKey: 'province',
      title: '省',
    },
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
      title: '分数',
    },
    {
      colKey: 'coreWord',
      title: '关键词',
    },
    {
      colKey: 'videoContent',
      resize: {
        maxWidth: 300,
      },
      title: '视频内容',
    },
    {
      cell: {
        _component: 'TypographyText',
      },
      colKey: 'originalUrl',
      resize: {
        maxWidth: 300,
      },
      title: '原链接',
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
    formItemMap.contentType,
    formItemMap.platform,
    formItemMap.publishTime,
    formItemMap.authorName,
    formItemMap.moodLevel,
  ],
  initialFormData: reactive({
    publishTime: [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  }),
  operations: [
    reactive({
      default: '添加原链接',
      disabled: computed(() => selectedRows.value.length === 0),
      onClick: () => {
        fillOriginalUrl(selectedRows.value).then(() => {
          pageListRef.value!.query()
        })
      },
      permission: 'data:contentInfo:fillOriginalUrl',
    }),
    reactive({
      default: '导出(旧)',
      disabled: computed(() => finallyQueryParams.value === undefined),
      permission: 'yq:followDetail:export',

      popconfirm: {
        content: '确认要导出吗?',
        onConfirm: async () => {
          const data = {
            ...finallyQueryParams.value,
          }

          if (selectedRows.value.length > 0) {
            data.ids = selectedRows.value.map((item) => item.id).join(',')
          }

          await alovaInst.Post('yq/followDetail/export', data, {
            meta: {
              useDownload: `关注详情_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
              useFormData: true,
              useResponseBlob: true,
            },
          })
        },
      },
    }),
    reactive({
      default: '导出(新)',
      disabled: computed(() => finallyQueryParams.value === undefined),
      permission: 'yq:followDetail:export',

      popconfirm: {
        content: '确认要导出吗?',
        onConfirm: async () => {
          const data = {
            ...finallyQueryParams.value,
          }

          if (selectedRows.value.length > 0) {
            data.ids = selectedRows.value.map((item) => item.id).join(',')
          }

          await alovaInst.Post('yq/followDetail/exportNewFormat', data, {
            meta: {
              useDownload: `关注详情_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
              useFormData: true,
              useResponseBlob: true,
            },
          })
        },
      },
    }),
    reactive({
      default: '更新评论',
      disabled: computed(() => selectedRows.value.length === 0),
      permission: 'data:commentInfo:handPullComments',
      popconfirm: {
        content: '确认要更新评论吗？',
        onConfirm: async () => {
          await handPullComments({
            contentIds: selectedRows.value.map((item) => item.contentId),
            funcId: id,
            funcName: data.value!.name,
            funcType: 2,
          })
        },
      },
    }),
    reactive({
      default: '导出评论',
      permission: 'yq:followManage:exportFollowComment',
      popconfirm: {
        content: '确认要导出评论吗？',
        onConfirm: async () => {
          await alovaInst.Post(
            'yq/followManage/exportFollowComment',
            {
              id,
            },
            {
              meta: {
                useDownload: `关注详情评论_${data.value?.name ?? ''}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
                useFormData: true,
                useResponseBlob: true,
              },
            },
          )
        },
      },
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
