<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    taskId: string
  }>(),
  {},
)
const formItemMap = {
  authorCode: {
    _class: 'col-span-2',
    _label: '作者code',
    model: 'authorCode',
  },
  authorName: {
    _label: '作者名称',
    model: 'authorName',
  },
  liveStatus: {
    _label: '直播状态',
    component: 'TSelect',
    dicCode: 'live_status',
    model: 'liveStatus',
  },
  notifyStatus: {
    _label: '直播通知状态',
    component: 'TSelect',
    dicCode: 'live_notify_status',
    model: 'notifyStatus',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('yq/liveInfo/list', {
          params: {
            ...o,
            taskId: props.taskId,
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
    {
      cell: {
        _component: 'TypographyText',
      },
      colKey: 'authorCode',
      resize: {
        maxWidth: 300,
      },
      title: '作者code',
    },
    useAuthorNameColumn({
      useLink: false,
    }),
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'live_status',
      },
      colKey: 'liveStatus',
      title: '直播状态',
    },
    {
      cell: {
        _component: 'Avatar',
      },
      colKey: 'headUrl',
      title: '作者头像',
    },
    {
      cell: {
        _component: 'ImageViewer',
      },
      colKey: 'liveCoverImgUrl',
      title: '直播封面',
    },
    {
      colKey: 'startTime',
      title: '直播开始时间',
    },
    {
      colKey: 'introduction',
      resize: {
        maxWidth: 300,
      },
      title: '直播介绍',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'live_notify_status',
      },
      colKey: 'notifyStatus',
      title: '直播通知状态',
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
    formItemMap.authorCode,
    formItemMap.authorName,
    formItemMap.liveStatus,
    formItemMap.notifyStatus,
  ],
  tableOtherProps: {
    flexHeight: false,
    showColumnConfigBtn: false,
    showToggleFullscreenBtn: false,
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
