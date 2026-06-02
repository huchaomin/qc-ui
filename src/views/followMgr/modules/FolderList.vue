<script setup lang="ts">
const { data, send } = useRequest(alovaInst.Get<Record<string, any>[]>('yq/followFolder/getList'), {
  initialData: [],
})

function add(node: Record<string, any>): void {
  const formRef = ref<FormInstance | null>(null)

  $confirm({
    body: () =>
      h(TForm, {
        items: [
          {
            _label: '品牌',
            _required: true,
            component: 'TSelect',
            model: 'brandId',
            options: 'brand',
          },
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
</script>

<template>
  <div class="h-full p-0.5">
    <TTree
      :data="[
        {
          label: '根目录',
          id: null,
          children: data,
        },
      ]"
      :keys="{
        value: 'id',
      }"
      expand-all
      class="h-full rounded-md p-2! shadow-(--td-shadow-1)"
    >
      <template #operations="{ node }">
        <TButton
          v-if="node['__tdesign_tree-node__'].level === 0"
          size="small"
          shape="square"
          variant="outline"
          @click="add(node)"
        >
          <template #icon>
            <Icon icon="line-md:plus"></Icon>
          </template>
        </TButton>
      </template>
    </TTree>
  </div>
</template>
