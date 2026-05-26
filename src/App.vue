<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next'
import Icon from './components/autoImport/Icon.vue'
import TButton from './components/tDesignReset/TButton.vue'

const globalConfig: GlobalConfigProvider = {
  table: {
    expandIcon: (h) => {
      return h(
        TButton,
        {
          shape: 'circle',
          variant: 'text',
        },
        {
          icon: () =>
            h(Icon, {
              icon: 'line-md:chevron-right',
            }),
        },
      )
    },
    sortIcon: (h) => {
      return h(
        TButton,
        {
          shape: 'circle',
          size: 'small',
          variant: 'text',
        },
        {
          icon: () =>
            h(Icon, {
              icon: 'heroicons-solid:sort-descending',
            }),
        },
      )
    },
    treeExpandAndFoldIcon: (h, { type }) => {
      return h(
        TButton,
        {
          shape: 'circle',
          variant: 'text',
        },
        {
          icon: () =>
            h(Icon, {
              icon: `line-md:chevron-${type === 'expand' ? 'right' : 'down'}`,
            }),
        },
      )
    },
  },
}
const userStore = useUserStore()
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView class="relative z-0"></RouterView>
    <TWatermark
      class="pointer-events-none fixed! top-0 right-0 bottom-0 left-0 z-[calc(Infinity)]"
      :watermark-content="[
        { text: userStore.userInfo.userName ?? '' },
        {
          text: userStore.userInfo.nickName ?? '',
        },
      ]"
      :y="100"
      :x="50"
      :removable="false"
      :line-space="24"
      :width="120"
      :height="60"
    >
    </TWatermark>
  </TConfigProvider>
</template>
