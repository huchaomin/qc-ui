<script setup lang="ts">
import type { DrawerInstance, DropdownProps } from 'tdesign-vue-next'
import { getRoute } from '@/router/index'
import Aside from './Aside.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()
const recentRoutersStore = useRecentRoutersStore()
// THeadMenu 内部会根据 slot 做缓存，和 v-for 生成的节点结构结合后，菜单项变更时它有机会不正确复用，导致你看到 TMenuItem 数量不刷新
const headMenuKey = computed(() =>
  recentRoutersStore.recentRouters.map((item) => item.name).join('|'),
)

function handleChange(name: number | string) {
  router.push(recentRoutersStore.recentRouters.find((item) => item.name === (name as string))!)
}

function handleClose(name: string) {
  recentRoutersStore.close(name)
}

const handleDropdownClick: DropdownProps['onClick'] = async (data) => {
  if (data.value === 'profile') {
    router.push({ name: 'Profile' })
  } else if (data.value === 'logout') {
    await $confirm('确定要退出登录吗？')
    useLoginStore().logout()
  }
}
const drawerInstance = ref<DrawerInstance | null>(null)

onMounted(() => {
  drawerInstance.value = $drawer({
    body: () => h(Aside, { class: 'no_drawer_body_padding' }),
    closeWhenCloseAll: false,
    destroyOnClose: false,
    footer: false,
    lazy: false,
    onOverlayClick: () => {
      commonStore.drawerOpen = false
    },
    placement: 'left',
    size: '250px',
  })
})
watch(
  () => commonStore.drawerOpen,
  (val) => {
    nextTick(() => {
      if (val) {
        drawerInstance.value!.show!()
      } else {
        drawerInstance.value!.hide!()
      }
    })
  },
  {
    immediate: true,
  },
)
watch(
  useMQ.isMd,
  (isMd) => {
    nextTick(() => {
      drawerInstance.value!.update!({
        mode: isMd ? 'overlay' : 'push',
        showOverlay: !!isMd,
      })
    })
  },
  {
    immediate: true,
  },
)
onBeforeUnmount(() => {
  drawerInstance.value!.destroy!()
})
</script>

<template>
  <THeader class="border-b border-b-(--td-border-level-2-color)">
    <THeadMenu
      :key="headMenuKey"
      expand-type="popup"
      :value="route.name as string"
      @change="handleChange"
    >
      <template #logo>
        <TButton
          shape="circle"
          variant="text"
          size="large"
          class="ml-0! shrink-0"
          @click="commonStore.drawerOpen = !commonStore.drawerOpen"
        >
          <Icon icon="lineicons:menu-hamburger-1" />
        </TButton>
      </template>
      <TMenuItem
        v-for="item in recentRoutersStore.recentRouters"
        :key="item.name"
        :value="item.name"
      >
        <div class="flex items-center justify-between">
          <span>
            {{ getRoute(item.name)!.meta.title }}
          </span>
          <TButton
            v-if="recentRoutersStore.recentRouters.length > 1"
            shape="square"
            variant="text"
            size="small"
            class="ml-1!"
            @click.stop="handleClose(item.name)"
          >
            <template #icon>
              <Icon icon="material-symbols:close" style="font-size: 12px !important" />
            </template>
          </TButton>
        </div>
      </TMenuItem>
      <template #operations>
        <TDropdown
          placement="bottom"
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
              <Icon icon="material-symbols:account-circle" class="mr-2!" />
            </template>
            {{ userStore.userInfo.userName }}
            <template #suffix>
              <Icon icon="icon-park-outline:down" size="18" />
            </template>
          </TButton>
        </TDropdown>
      </template>
    </THeadMenu>
  </THeader>
</template>

<style scoped>
.t-head-menu {
  /* stylelint-disable-next-line custom-property-pattern */
  --td-comp-paddingLR-m: var(--td-size-3);
  --td-comp-size-xxxl: var(--td-comp-size-xxl);
}

:deep() {
  --td-comp-size-xxxl: calc(var(--td-comp-size-xxl) + 1px);

  .t-menu__logo {
    margin: 0 8px !important;
  }

  .t-head-menu__inner li + li {
    margin-left: 4px;
  }
}
</style>
