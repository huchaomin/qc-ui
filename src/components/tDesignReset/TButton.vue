<script setup lang="ts">
import type { ButtonProps as _ButtonProps } from 'tdesign-vue-next'
import type { PopconfirmProps } from '@/components/tDesignReset/TPopconfirm.vue'
import { mergeProps, resolveDirective, withDirectives } from 'vue'
import { buttonPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), buttonPropsInit)

export type ButtonProps = {
  /**
   * @description: 是否自动添加icon, 默认 true
   */
  autoIcon?: boolean
  /**
   * @description: 按钮权限点
   */
  permission?: Parameters<typeof checkPermissions>[0]
  popconfirm?: Omit<PopconfirmProps, 'default'>
  /**
   * @description: 按钮是否渲染，默认 true
   */
  show?: boolean
} & Omit<_ButtonProps, 'content'>

const otherProps = computed(() => {
  const obj: Partial<ButtonProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  delete obj.permission
  delete obj.popconfirm
  delete obj.show
  return obj
})
const compo = _Button
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const textContent = ref('')

function setTextContent() {
  textContent.value = vm.exposed!.$el?.textContent ?? ''
}

onMounted(() => {
  setTextContent()
})
onUpdated(() => {
  setTextContent()
})

const autoIcon = computed(() => {
  if (!props.autoIcon || textContent.value.trim() === '') {
    return undefined
  }

  const map = {
    'mdi:account-outline': ['角色'],
    'mdi:add': ['新增', '添加'],
    'mdi:close': ['关闭', '取消'],
    'mdi:content-save': ['保存', '提交'],
    'mdi:delete-outline': ['删除'],
    'mdi:download': ['下载', '导出'],
    'mdi:file-edit-outline': ['编辑'],
    'mdi:file-outline': ['文件'],
    'mdi:refresh': ['刷新', '重置'],
    'mdi:search': ['查询', '搜索'],
    'mdi:upload': ['上传', '导入'],
  }
  let icon: string | undefined

  for (const [key, value] of Object.entries(map)) {
    if (value.some((item) => textContent.value.includes(item))) {
      icon = key
      break
    }
  }

  if (icon === undefined) {
    return undefined
  }

  return icon
})
const TButtonComponent = computed(() => {
  const vNode = h(
    compo,
    mergeProps(
      useAttrs(),
      {
        ...otherProps.value,
        ref: compoRef,
      },
      {
        class: 'flex-shrink-0',
      },
    ),
  )

  return withDirectives(vNode, [[resolveDirective('permission'), props.permission]])
})
</script>

<template>
  <template v-if="props.show">
    <TPopconfirm v-if="props.popconfirm" v-bind="props.popconfirm">
      <TButtonComponent>
        <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
          <slot :name="k" v-bind="slotScope"></slot>
        </template>
        <template v-if="autoIcon" #icon>
          <Icon :icon="autoIcon"></Icon>
        </template>
      </TButtonComponent>
    </TPopconfirm>
    <TButtonComponent v-else>
      <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
        <slot :name="k" v-bind="slotScope"></slot>
      </template>
      <template v-if="autoIcon" #icon>
        <Icon :icon="autoIcon"></Icon>
      </template>
    </TButtonComponent>
  </template>
</template>

<style scoped>
:deep() {
  .iconify {
    flex-shrink: 0;
    font-size: calc(1em + 2px) !important;

    &:has(+ .t-button__text) {
      @apply mr-1;
    }
  }
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-m);
}
</style>
