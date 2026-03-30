<script setup lang="ts">
// :check-strictly="!formData.menuCheckStrictly" 后台有bug, 父子不联动的情况下才会返回父节点的id

import type { TreeProps } from 'tdesign-vue-next'
import { treeToFlatArr } from '@/utils'

const props = withDefaults(
  defineProps<{
    menuOptions: any[]
  }>(),
  {},
)
const formData = inject<Record<string, any>>('formData')!
const expandAll = ref(false)
const selectAll = ref(false)
const menuCheckStrictly = ref(true)
const flatData = computed(() => {
  const arr: any[] = []
  const flatTree = (tree: any[]) => {
    tree.forEach((item) => {
      arr.push(item)

      if (item.children) {
        flatTree(item.children)
      }
    })
  }

  flatTree(props.menuOptions)
  return arr
})

watch(selectAll, (val) => {
  if (val) {
    formData.menuIds = flatData.value.map((item: any) => item.id)
  } else {
    formData.menuIds = []
  }
})

const treeRef = useTemplateRef('treeRef')
const handleChange: TreeProps['onChange'] = (...args) => {
  if (!menuCheckStrictly.value) {
    return
  }

  const { node, trigger } = args[1]
  const boolean = args[0].includes(node.value!)

  if (trigger === 'node-click') {
    const tree = treeRef.value!.getTreeData(node.value)
    const arr = treeToFlatArr(tree as any[])

    arr.forEach((item) => {
      treeRef.value!.setItem(item.value, {
        checked: boolean,
      })
    })
  }
}
</script>

<template>
  <div class="w-full">
    <div class="mb-1 flex gap-4">
      <TCheckbox v-model="expandAll" label="展开/折叠"></TCheckbox>
      <TCheckbox v-model="selectAll" label="全选/全不选"></TCheckbox>
      <TCheckbox v-model="menuCheckStrictly" label="父子联动"></TCheckbox>
    </div>
    <TTree
      ref="treeRef"
      v-model="formData.menuIds"
      :data="menuOptions"
      checkable
      :expand-all="expandAll"
      :keys="{
        value: 'id',
      }"
      :check-strictly="true"
      @change="handleChange"
    ></TTree>
  </div>
</template>
