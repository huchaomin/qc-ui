<script setup lang="ts">
import type { DropdownOption } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<{
    allData: Record<string, any>[]
  }>(),
  {},
)
const emit = defineEmits<{
  activeChange: [active: string]
  folderListChange: [folderList: Record<string, any>[]]
}>()
const { data, send } = useRequest(alovaInst.Get<Record<string, any>[]>('yq/followFolder/getList'), {
  initialData: [],
}).onSuccess(() => {
  emit('folderListChange', data.value)
})
const treeData = computed(() => {
  return [
    {
      id: 'all',
      length: props.allData.length,
      name: '所有',
    },
    ...data.value.map((item) => ({
      ...item,
      length: props.allData.filter((i) => i.folderId === item.id).length,
    })),
    {
      id: 'unclassified',
      length: props.allData.filter((item) => item.folderId === null).length,
      name: '未分文件夹',
    },
  ]
})

function add(): void {
  const formRef = ref<FormInstance | null>(null)

  $confirm({
    body: () =>
      h(TForm, {
        items: [
          {
            _label: '文件夹名称',
            _required: true,
            model: 'name',
          },
        ],
        ref: formRef,
      }),
    header: '新增文件夹',
    onConfirmCallback: async () => {
      await alovaInst.Post('yq/followFolder', await formRef.value!.validate())
      $msg('文件夹新增成功')
      send()
    },
  })
}

function getTreeIcon(node: Record<string, any>): string {
  if (node.value === 'all') {
    return 'tabler:letter-a'
  }

  if (node.value === 'unclassified') {
    return 'fluent:question-16-filled'
  }

  if (node.data.topFlag === 1) {
    return 'material-symbols:folder'
  }

  return 'material-symbols:folder-outline'
}

async function togglePin(node: Record<string, any>, topFlag: number): Promise<void> {
  await alovaInst.Put(`yq/followFolder/pin/${node.value}`, {
    topFlag,
  })
  $msg(`文件夹${node.label}${topFlag === 1 ? '置顶' : '取消置顶'}成功`)
  send()
}

const actived = ref(['all'])

watch(actived, (val) => {
  emit('activeChange', val[0])
})

async function handleActions(e: DropdownOption, node: Record<string, any>) {
  if (e.value === 'delete') {
    await $confirm(`确定要删除${node.label}文件夹吗？`)
    await alovaInst.Delete(`yq/followFolder/${node.value}`)
    $msg('文件夹删除成功')
    send()

    if (node.actived) {
      actived.value = ['all']
    }
  } else if (e.value === 'pin') {
    await togglePin(node, 1)
  } else if (e.value === 'unpin') {
    await togglePin(node, 0)
  } else if (e.value === 'rename') {
    const formRef = ref<FormInstance | null>(null)

    watch(
      formRef,
      () => {
        formRef.value!.setFormData({
          name: node.label,
        })
      },
      {
        once: true,
      },
    )
    $confirm({
      body: () =>
        h(TForm, {
          items: [
            {
              _label: '文件夹名称',
              _required: true,
              model: 'name',
            },
          ],
          ref: formRef,
        }),
      header: '修改文件夹',
      onConfirmCallback: async () => {
        await alovaInst.Put('yq/followFolder', {
          ...(await formRef.value!.validate()),
          id: node.value,
        })
        $msg('文件夹修改成功')
        send()
      },
    })
  }
}

function handleHover(visible: boolean, node: Record<string, any>): void {
  node.setData({
    hover: visible,
  })
}
</script>

<template>
  <div class="flex min-h-full flex-col p-0.5">
    <TTree
      v-model:actived="actived"
      :data="treeData"
      :keys="{
        value: 'id',
        label: 'name',
      }"
      activable
      :transition="false"
      class="flex-1 rounded-md p-2! shadow-(--td-shadow-1)"
    >
      <template #label="{ node }">
        <div
          class="flex items-center"
          :class="{
            hover: node.data.hover,
          }"
          style="min-height: 24px"
        >
          <Icon :icon="getTreeIcon(node)" size="18" class="shrink-0"></Icon>
          <TTypographyText ellipsis class="my-0! mr-auto! ml-1!">
            {{ node.label }} ({{ node.data.length }})
          </TTypographyText>
          <TButton
            v-if="node.value === 'all'"
            title="新增文件夹"
            class="inline-flex!"
            size="small"
            shape="square"
            variant="outline"
            @click.stop="add"
          >
            <template #icon>
              <Icon icon="line-md:plus"></Icon>
            </template>
          </TButton>
          <template v-if="!['all', 'unclassified'].includes(node.value)">
            <TDropdown
              trigger="click"
              :max-column-width="Infinity"
              :options="[
                ...(node.data.topFlag === 0
                  ? [{ content: '置顶文件夹', value: 'pin' }]
                  : [{ content: '取消置顶', value: 'unpin' }]),
                { content: '修改文件夹名称', value: 'rename' },
                { content: '删除', value: 'delete' },
              ]"
              :popup-props="{
                onVisibleChange: (visible) => {
                  handleHover(visible, node)
                },
              }"
              @click="(e) => handleActions(e, node)"
            >
              <TButton size="small" shape="circle" variant="text" @click.stop>
                <Icon icon="tabler:dots-filled"></Icon>
              </TButton>
            </TDropdown>
          </template>
        </div>
      </template>
    </TTree>
  </div>
</template>

<style scoped>
:deep() {
  .t-tree__item {
    .t-button {
      display: none;
    }

    &:hover,
    &:has(.hover) {
      .t-button {
        display: inline-flex;
      }
    }
  }

  .t-tree__label:not(.t-is-active, .t-is-checked) {
    &:has(.hover) {
      background-color: var(--td-bg-color-container-hover);
    }
  }
}
</style>
