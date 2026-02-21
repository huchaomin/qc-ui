<script setup lang="ts">
import type { Method } from 'alova'
import type {
  UploadFile as _UploadFile,
  UploadInstanceFunctions as _UploadInstanceFunctions,
  UploadProps as _UploadProps,
  RequestMethodResponse,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UploadProps>(), {
  multiple: false,
  theme: 'file',
  // accept: '.xlsx,.xls',
  /**
   * @description: 怎么展示文件名:前面8位，后面6位，中间省略号
   */
  // abridgeName: () => [8, 6],
  useMockProgress: true,
})
const innerModelValue = defineModel<UploadFile[]>('modelValue', {
  default: [],
})

export type UploadFile = _UploadFile
export type UploadInstanceFunctions = _UploadInstanceFunctions
export type UploadProps = Omit<
  _UploadProps,
  | 'action'
  | 'data'
  | 'defaultFiles'
  | 'defaultValue'
  | 'files'
  | 'format'
  | 'formatRequest'
  | 'formatResponse'
  | 'headers'
  | 'method'
  | 'name'
  | 'requestMethod'
  | 'value'
> & {
  requestMethod?: (file: UploadFile | UploadFile[]) => Method
}

type OnChangeParams = Parameters<NonNullable<_UploadProps['onChange']>>

const finallyRequestMethod = computed(() => {
  if (props.requestMethod === undefined) {
    return undefined
  }

  return (file: UploadFile | UploadFile[]) =>
    new Promise<RequestMethodResponse>((resolve) => {
      props.requestMethod!(file)
        .then((res) => {
          resolve({
            status: 'success',
            ...res,
          })
        })
        .catch((err) => {
          resolve({
            error: err.message ?? '上传失败',
            response: {},
            status: 'fail',
          })
        })
    })
})
const otherProps = computed(() => {
  const obj: Partial<UploadProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Upload
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

defineExpose({} as UploadInstanceFunctions)
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          requestMethod: finallyRequestMethod,
          modelValue: innerModelValue,
          onChange: (...args: OnChangeParams) => {
            innerModelValue = args[0]
            props.onChange?.(...args)
          },
          ref: compoRef,
        }),
      )
    "
  >
    <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
      <slot :name="k" v-bind="slotScope"></slot>
    </template>
    <template v-if="otherProps.theme === 'file'" #trigger="{ files }">
      <TButton theme="primary">
        {{ files.length > 0 ? (otherProps.multiple ? '继续上传' : '重新上传') : '选择文件' }}
      </TButton>
    </template>
  </component>
</template>
