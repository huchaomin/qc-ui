<script lang="ts" setup>
import type Picker from './Picker.vue'
import type { TagInputProps } from '@/components/tDesignReset/TTagInput.vue'
import { mergeProps } from 'vue'
import TButton from '@/components/tDesignReset/TButton.vue'
import { tagInputPropsInit } from '@/components/tDesignReset/TTagInput.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectSysUserProps>(), tagInputPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()
const otherProps = computed(() => {
  const obj: SelectSysUserProps = {
    ...props,
    adornment: {
      append: () =>
        h(TButton, {
          default: '选择用户',
          onClick: () => {
            const compoRef = ref<InstanceType<typeof Picker> | null>(null)

            void $confirm({
              body: () =>
                h(
                  defineAsyncComponent(() => import('./Picker.vue')),
                  {
                    max: props.max,
                    modelValue: props.modelValue,
                    onVnodeMounted: (vnode) => {
                      compoRef.value = vnode.component!.exposed as InstanceType<typeof Picker>
                    },
                    onVnodeUnmounted: () => {
                      compoRef.value = null
                    },
                  },
                ),
              header: '选择用户',
              onConfirmCallback: async () => {
                const result = await compoRef.value!.handleSubmit()

                emit('update:modelValue', result)
              },
              width: 1000,
            })
          },
          variant: 'text',
        }),
    },
  }

  return obj
})

export type SelectSysUserProps = Omit<TagInputProps, 'modelValue'> & {
  modelValue: string[]
}

type OnChangeParams = Parameters<NonNullable<TagInputProps['onChange']>>

const attrs = useAttrs()
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const selectSysUserBindProps = computed(() => {
  return mergeProps(attrs, {
    ...otherProps.value,
    inputProps: {
      readonly: true,
      ...(props.inputProps ?? {}),
    },
    onChange: (...args: OnChangeParams) => {
      emit('update:modelValue', args[0] as string[])
      props.onChange?.(...args)
    },
    placeholder: '请选择用户',
    ref: compoRef,
  }) as SelectSysUserProps
})
</script>

<template>
  <TTagInput v-bind="selectSysUserBindProps">
    <template #tag="{ value }">
      {{ useSysUser(value).value?.userName }}
    </template>
  </TTagInput>
</template>
