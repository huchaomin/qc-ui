<script setup lang="ts">
import type { DropdownProps, TabsProps } from 'tdesign-vue-next'
import { getRoute } from '@/router/index'

const route = useRoute()
const router = useRouter()
const commonStore = useCommonStore()
const recentRoutersStore = useRecentRoutersStore()

const handleRemove: TabsProps['onRemove'] = ({ value }) => {
  const name = value as string

  if (route.name === name) {
    const currentIndex = recentRoutersStore.recentRouters.findIndex(
      (item) => item.name === name,
    )
    const pre = recentRoutersStore.recentRouters[currentIndex - 1]

    if (pre !== undefined) {
      router.push(pre)
    } else {
      router.push(recentRoutersStore.recentRouters[currentIndex + 1]!)
    }
  }

  recentRoutersStore.remove(name)
}

const handleChange: TabsProps['onChange'] = (val) => {
  router.push(
    recentRoutersStore.recentRouters.find((item) => item.name === val)!,
  )
}

const handleDropdownClick: DropdownProps['onClick'] = async (data) => {
  if (data.value === 'profile') {
    router.push({ name: 'Profile' })
  } else if (data.value === 'logout') {
    await $confirm('确定要退出登录吗？')
    useLoginStore().logout()
  }
}
</script>

<template>
  <THeader
    height="var(--td-comp-size-xxl)"
    class="flex items-center border-b border-b-[var(--td-border-level-2-color)] px-2"
  >
    <TButton
      shape="circle"
      variant="text"
      size="large"
      @click="commonStore.drawerOpen = !commonStore.drawerOpen"
    >
      <Icon icon="lineicons:menu-hamburger-1" />
    </TButton>
    <TTabs
      :value="route.name as string"
      class="!mx-2 flex-1"
      @remove="handleRemove"
      @change="handleChange"
    >
      <TTabPanel
        v-for="item in recentRoutersStore.recentRouters"
        :key="item.name"
        :value="item.name"
        :label="getRoute(item.name)!.meta.title"
        :removable="recentRoutersStore.recentRouters.length > 1"
      >
      </TTabPanel>
    </TTabs>
    <TDropdown
      :options="[
        {
          content: '个人中心',
          value: 'profile',
        },
        {
          content: '退出登录',
          value: 'logout',
        },
      ]"
      trigger="click"
      @click="handleDropdownClick"
    >
      <TButton variant="text">
        <template #icon>
          <Icon icon="material-symbols:account-circle" class="mr-2" />
        </template>
        更多
        <template #suffix>
          <Icon icon="icon-park-outline:down" size="18" />
        </template>
      </TButton>
    </TDropdown>
  </THeader>
</template>

<style scoped>
:deep() {
  .t-tabs__content {
    display: none;
  }
}
</style>
