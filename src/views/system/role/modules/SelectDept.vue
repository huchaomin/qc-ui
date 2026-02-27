<script setup lang="ts">
// :check-strictly="!formData.menuCheckStrictly" 后台有bug, 父子不联动的情况下才会返回父节点的id

const props = withDefaults(
  defineProps<{
    deptOptions: any[]
  }>(),
  {},
)
const formData = inject<Record<string, any>>('formData')!
const expandAll = ref(true)
const selectAll = ref(false)
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

  flatTree(props.deptOptions)
  return arr
})

watch(selectAll, (val) => {
  if (val) {
    formData.deptIds = flatData.value.map((item: any) => item.id)
  } else {
    formData.deptIds = []
  }
})
</script>

<template>
  <div class="w-full">
    <div class="mb-1 flex gap-4">
      <TCheckbox v-model="expandAll" label="展开/折叠"></TCheckbox>
      <TCheckbox v-model="selectAll" label="全选/全不选"></TCheckbox>
    </div>
    <TTree
      v-model="formData.deptIds"
      :data="deptOptions"
      checkable
      :expand-all="expandAll"
      :keys="{
        value: 'id',
      }"
      :check-strictly="true"
    ></TTree>
  </div>
</template>
