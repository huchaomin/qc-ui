<script setup lang="ts">
import { handPullComments } from '@/bus'

const formItemMap = {
  brandId: {
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  name: {
    _label: '组名称',
    _required: true,
    model: 'name',
  },
} satisfies Record<string, FormItem>
const { data, send } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/followManage/getList'),
  {
    initialData: [],
  },
)

function handleAdd(): void {
  const formRef = ref<FormInstance | null>(null)

  $confirm({
    body: () =>
      h(resolveComponent('TForm') as Component<FormProps>, {
        items: [formItemMap.name, formItemMap.brandId],
        labelAlign: 'right',
        layout: 'vertical',
        ref: formRef,
      }),
    header: '新增组',
    onConfirmCallback: async () => {
      await alovaInst.Post('yq/followManage', await formRef.value!.validate())
      $msg('组新增成功')
      send()
    },
    width: 430, // 730
  })
}

async function handleDelete(item: Record<string, any>): Promise<void> {
  await alovaInst.Delete(`yq/followManage/${item.id}`)
  $msg('删除成功')
  send()
}

function handleEdit(row: Record<string, any>): void {
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
          formItemMap.name,
          {
            ...formItemMap.brandId,
            disabled: true,
          },
        ],
        labelAlign: 'right',
        layout: 'vertical',
        ref: formRef,
      }),
    header: '修改组',
    onConfirmCallback: async () => {
      await alovaInst.Put('yq/followManage', {
        ...(await formRef.value!.validate()),
        id: row.id,
      })
      $msg('组修改成功')
      send()
    },
    width: 430, // 730
  })
}
</script>

<template>
  <TCard body-full-height class="h-full" body-class-name="!flex flex-col overflow-y-auto">
    <TButton class="mb-4! w-fit" permission="yq:followManage:add" @click="handleAdd">
      新增组
    </TButton>
    <TList v-if="data.length > 0" class="-m-3! p-3!">
      <TListItem v-for="item in data" :key="item.id">
        <template #default>
          <TCard
            class="w-full"
            :title="item.name"
            title-ellipsis
            :header-bordered="false"
            header-class-name="pb-0!"
          >
            <template #actions>
              <TButton
                permission="data:commentInfo:handPullComments"
                class="ml-auto"
                theme="default"
                size="small"
                :popconfirm="{
                  content: '确认更新评论吗？',
                  onConfirm: async () => {
                    handPullComments({
                      funcType: 2,
                      funcName: item.name,
                      funcId: item.id,
                    })
                  },
                }"
              >
                更新评论
              </TButton>
              <TButton
                permission="yq:followManage:edit"
                theme="default"
                size="small"
                @click="handleEdit(item)"
              >
                修改
              </TButton>
              <TButton
                permission="yq:followManage:remove"
                theme="default"
                size="small"
                :popconfirm="{
                  content: '确认删除吗',
                  onConfirm: async () => {
                    handleDelete(item)
                  },
                }"
              >
                删除
              </TButton>
            </template>
            <div class="mt-2 flex items-center">
              <Icon icon="mdi-copyright" size="22" class="text-(--td-brand-color)"></Icon>
              <span class="ml-2">品牌：</span>
              <span class="ml-2">{{ useListLabel('brand', item.brandId) }}</span>
            </div>
            <div class="mt-2 flex items-center">
              <Icon icon="mdi-tag-multiple" size="22" class="text-(--td-success-color)"></Icon>
              <span class="ml-2">涉及平台：</span>
              <span class="ml-2">{{ item.platforms ?? '-' }}</span>
            </div>
            <div class="mt-2 flex items-center">
              <Icon icon="mdi-account" size="24" class="text-(--td-error-color)"></Icon>
              <span class="ml-2">创建人：</span>
              <span class="ml-2">
                {{ `${item.createBy}(${dayjs(item.createTime).format('YYYY-MM-DD')})` }}
              </span>
            </div>
          </TCard>
        </template>
      </TListItem>
    </TList>
  </TCard>
</template>

<style scoped>
:deep() {
  .t-list-item {
    padding: 0;
  }

  .t-list__inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
  }
}
</style>
