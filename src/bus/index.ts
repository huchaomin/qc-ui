/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-unsafe-assignment */
import CommentDetail from './components/commentDetail/Index.vue'
import FillOriginalUrl from './components/FillOriginalUrl.vue'

export function addFollow(arr: Array<Record<string, any>>): void {
  const hasTwoBrand = arr.some((item) => item.brandId !== arr[0]!.brandId)

  if (hasTwoBrand) {
    void $msg.error('只能添加同的品牌')
    return
  }

  const formRef = ref<FormInstance | null>(null)

  void $confirm({
    body: () =>
      h(resolveComponent('TForm') as Component<FormProps>, {
        items: [
          reactive({
            _label: '关注组',
            _required: true,
            component: 'TSelect' as const,
            model: 'followId',
            options: computed(() =>
              useList('follow').value.filter((item) => item.brandId === arr[0]!.brandId),
            ),
          }),
        ],
        labelAlign: 'right',
        layout: 'vertical',
        ref: formRef,
      }),
    header: '添加关注',
    onConfirmCallback: async () => {
      await alovaInst.Post('yq/followDetail/addFollow', {
        ...(await formRef.value!.validate()),
        bciIds: arr.map((item) => (item.bciId ?? item.id) as string),
      })
      void $msg('添加关注成功')
    },
    width: 430, // 730
  })
}
export function fillOriginalUrl(arr: Array<Record<string, any>>): Promise<void> {
  return new Promise((resolve) => {
    const hasOriginalUrlArr = arr.filter((item) => !isFalsy(item.originalUrl))
    const noneOriginalUrlArr = arr.filter((item) => isFalsy(item.originalUrl))

    if (noneOriginalUrlArr.length === 0) {
      void $msg.warning('所选项已全部添加原链接')
      return
    }

    const compoRef = ref<InstanceType<typeof FillOriginalUrl> | null>(null)

    void $confirm({
      body: () =>
        h(FillOriginalUrl, {
          hasOriginalUrlArr,
          noneOriginalUrlArr,
          ref: compoRef,
        }),
      header: '添加原链接',
      onConfirmCallback: async () => {
        await compoRef.value!.handleSubmit()
        resolve()
      },
      width: 1000, // 730
    })
  })
}
export async function handPullComments(data: Record<string, any>): Promise<void> {
  await alovaInst.Post('data/commentInfo/handPullComments', data)
  void $confirm({
    body: '请到【数据中心-评论手动拉取记录】查看更新结果',
  })
}
export function showCommentDetail(data: Record<string, any>): void {
  $dialog({
    body: () => h(CommentDetail, { data }),
    cancelBtn: null,
    confirmBtn: null,
    header: '评论详情',
    width: 1280,
  })
}
export async function updateDealMark(arr: Array<Record<string, any>>): Promise<void> {
  const dealMarkArr = [...new Set(arr.map((item) => item.dealMark as number))]
  const formRef = ref<FormInstance | null>(null)

  return new Promise((resolve) => {
    void $confirm({
      body: () =>
        h(resolveComponent('TForm') as Component<FormProps>, {
          data: reactive({
            dealMark: dealMarkArr.length === 1 ? dealMarkArr[0] : '',
          }),
          items: [
            {
              _label: '处理状态',
              _required: true,
              component: 'TSelect',
              dicCode: 'deal_mark',
              model: 'dealMark',
            },
          ],
          labelAlign: 'right',
          layout: 'vertical',

          ref: formRef,
        }),
      header: '标记视频',
      onConfirmCallback: async () => {
        await alovaInst.Put('task/taskContent/updateDealMark', {
          ...(await formRef.value!.validate()),
          bciIds: arr.map((item) => (item.bciId ?? item.id) as string),
        })
        void $msg('标记视频成功')
        resolve()
      },
      width: 430, // 730
    })
  })
}
export async function warnByHand(data: Record<string, any>): Promise<void> {
  await $confirm({
    body: `确定对视频【${data.title}】手工预警吗？`,
    width: 500,
  })
  await alovaInst.Put(`data/brandContentInfo/warnByHand/${data.bciId ?? data.id}`)
  void $msg('手工预警成功')
}
