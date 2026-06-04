<script setup lang="ts">
import type { ButtonProps } from '@/components/tDesignReset/TButton.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonsProps>(), {})

export interface ButtonsProps {
  buttons: Array<((context: CellRenderContext) => ButtonProps) | ButtonProps>
}

const attrs = useAttrs() as unknown as CellRenderContext
const finallyButtons = computed(() => {
  return props.buttons
    .map((item) => {
      return typeof item === 'function' ? item(attrs) : item
    })
    .filter((item) => item.show !== false && checkPermissions(item.permission))
})
</script>

<template>
  <div class="flex">
    <TButton
      v-for="(child, index) in finallyButtons.slice(0, finallyButtons.length === 4 ? 4 : 3)"
      :key="index"
      v-bind="{
        theme: 'primary',
        variant: 'text',
        ...child,
      }"
    >
      {{ _get(attrs.row, attrs.col.colKey) }}
    </TButton>
    <TPopup v-if="finallyButtons.length > 4">
      <TButton shape="square" theme="primary" variant="text">
        <template #icon>
          <Icon icon="ri:more-fill" />
        </template>
      </TButton>
      <template #content>
        <div>
          <TButton
            v-for="(child, index) in finallyButtons.slice(3)"
            :key="index"
            v-bind="{
              theme: 'primary',
              variant: 'text',
              ...child,
            }"
          >
            {{ _get(attrs.row, attrs.col.colKey) }}
          </TButton>
        </div>
      </template>
    </TPopup>
  </div>
</template>

<style scoped>
:deep() {
  .t-button {
    + .t-button {
      margin-left: 0;
    }
  }
}
</style>
