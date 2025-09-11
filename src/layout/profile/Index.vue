<script setup lang="ts">
import ResetPwd from './ResetPwd.vue'
import UserInfo from './UserInfo.vue'

const { data, send } = useRequest(
  alovaInst.Get<Record<string, any>>('system/user/profile', {
    meta: {
      useDataResult: false,
    },
  }),
  {
    initialData: {},
  },
)
const listItems = computed(() => {
  const info = data.value.data

  return info !== undefined
    ? [
        {
          description: info.userName,
          title: '用户名称',
        },
        {
          description: info.phonenumber,
          title: '手机号码',
        },
        {
          description: info.email,
          title: '用户邮箱',
        },
        {
          description: [info.dept?.deptName, data.value.postGroup]
            .filter((item) => !isFalsy(item))
            .join('/'),
          title: '所属部门',
        },
        {
          description: data.value.roleGroup,
          title: '所属角色',
        },
        {
          description: info.createTime,
          title: '创建日期',
        },
      ]
    : []
})
const tab = ref('userInfo')
const tabs = reactive([
  {
    component: markRaw(UserInfo),
    label: '基本资料',
    value: 'userInfo',
  },
  {
    component: markRaw(ResetPwd),
    label: '修改密码',
    value: 'resetPwd',
  },
])

provide(
  'userInfo',
  computed(() => data.value.data),
)
</script>

<template>
  <div class="flex gap-4">
    <TCard title="个人信息" class="flex-1">
      <TList split>
        <TListItem v-for="item in listItems" :key="item.title" class="!px-0">
          <TListItemMeta
            :title="item.title"
            :description="isFalsy(item.description) ? '/' : item.description"
          />
        </TListItem>
      </TList>
    </TCard>
    <TCard title="基本资料" class="flex-1">
      <TTabs v-model="tab" size="large" class="!-mt-4">
        <TTabPanel
          v-for="item in tabs"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          lazy
          :destroy-on-hide="false"
        >
          <Component
            :is="item.component"
            class="!mt-4"
            @update="send"
          ></Component>
        </TTabPanel>
      </TTabs>
    </TCard>
  </div>
</template>
