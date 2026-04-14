<script lang="ts" setup>
import type Picker from './Picker.vue'
import type { InputProps } from '@/components/tDesignReset/TInput.vue'
import { mergeProps } from 'vue'
import TButton from '@/components/tDesignReset/TButton.vue'
import { inputPropsInit } from '@/components/tDesignReset/TInput.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CronProps>(), inputPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const otherProps = computed(() => {
  const obj: CronProps = {
    ...props,
    adornment: {
      append: () =>
        h(TButton, {
          default: 'cron',
          onClick: () => {
            const compoRef = ref<InstanceType<typeof Picker> | null>(null)

            void $confirm({
              body: () =>
                h(
                  defineAsyncComponent(() => import('./Picker.vue')),
                  {
                    modelValue: props.modelValue,
                    onVnodeMounted: (vnode) => {
                      compoRef.value = vnode.component!.exposed as InstanceType<typeof Picker>
                    },
                    onVnodeUnmounted: () => {
                      compoRef.value = null
                    },
                  },
                ),
              header: 'cron表达式',
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

export type CronProps = Omit<InputProps, 'modelValue'> & {
  modelValue: string
}

type OnChangeParams = Parameters<NonNullable<InputProps['onChange']>>

const attrs = useAttrs()
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const cronBindProps = computed(() => {
  return mergeProps(attrs, {
    ...otherProps.value,
    onChange: (...args: OnChangeParams) => {
      emit('update:modelValue', args[0] as string)
      props.onChange?.(...args)
    },
    ref: compoRef,
  }) as CronProps
})
</script>

<template>
  <TInput v-bind="cronBindProps"></TInput>
</template>
