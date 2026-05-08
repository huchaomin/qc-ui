<script setup lang="ts">
import Handsel from './modules/Handsel.vue'
import TopUp from './modules/TopUp.vue'
import TopUpRecord from './modules/TopUpRecord.vue'
import UsageRecord from './modules/UsageRecord.vue'

const { data, send } = useRequest(
  alovaInst.Get<Record<string, any> | undefined>('yq/pointsWallet/userPointsWallet'),
  {
    initialData: undefined,
  },
)
const _pointsChangeTypeList = useDicOptions('points_change_type')
const pointsChangeTypeList = computed(() => {
  return _pointsChangeTypeList.value.filter((item) => !isFalsy(item.remark))
})
const tabs = [
  {
    component: markRaw(TopUp),
    icon: 'f7:money-yen-circle',
    label: '充值',
    permission: 'yq:pointsWallet:pointsWalletCharge',
    props: {
      onUpdate: send,
    },
    value: 'topUp',
  },
  {
    component: markRaw(Handsel),
    icon: 'ph:hand-deposit',
    label: '赠送',
    permission: 'yq:pointsWallet:pointsGive',
    props: {
      onUpdate: send,
    },
    value: 'handsel',
  },
  {
    component: markRaw(UsageRecord),
    icon: 'material-symbols:history',
    label: '使用记录',
    permission: 'yq:pointsRecord:list',
    value: 'usageRecord',
  },
  {
    component: markRaw(TopUpRecord),
    icon: 'stash:payment-link',
    label: '充值记录',
    permission: 'yq:pointsRecord:list',
    value: 'rechargeRecord',
  },
].filter((item) => checkPermissions(item.permission))
const tab = ref(tabs[0]!.value)
</script>

<template>
  <TCard
    body-full-height
    class="h-full"
    subtitle="查看积分余额、充值记录和使用历史"
    :header-bordered="false"
    body-class-name="!flex flex-col overflow-y-auto"
    header-class-name="pb-0!"
  >
    <template #title>
      <TTypographyTitle level="h4" class="my-0!">积分管理</TTypographyTitle>
    </template>
    <div v-if="data" class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <TCard :header-bordered="false" body-class-name="pt-0!">
        <template #title>
          <div class="flex items-center">
            <Icon icon="heroicons-solid:credit-card" />
            <span class="ml-2">当前余额</span>
          </div>
        </template>
        <TStatistic :value="Number(data.totalPoints ?? 0)"></TStatistic>
      </TCard>
      <TCard :header-bordered="false" body-class-name="pt-0!">
        <template #title>
          <div class="flex items-center">
            <Icon icon="material-symbols:data-usage-rounded" />
            <span class="ml-2">已使用</span>
          </div>
        </template>
        <TStatistic :value="Number(data.usedPoints ?? 0)"></TStatistic>
      </TCard>
      <TCard :header-bordered="false" body-class-name="pt-0!">
        <template #title>
          <div class="flex items-center">
            <Icon icon="icon-park-outline:deposit" />
            <span class="ml-2">累计充值</span>
          </div>
        </template>
        <TStatistic :value="Number(data.chargePoints ?? 0)"></TStatistic>
      </TCard>
    </div>
    <TCard
      class="mt-4!"
      title="功能积分消耗"
      subtitle="各AI功能每次调用所需积分"
      :header-bordered="false"
      header-class-name="pb-0!"
    >
      <div class="grid grid-cols-3 gap-4">
        <TCard
          v-for="item in pointsChangeTypeList"
          :key="item.value"
          :bordered="true"
          :title="item.label"
          :shadow="false"
          :subtitle="item.cssClass"
          :header-bordered="false"
          header-class-name="items-center!"
        >
          <template #actions>
            <TTag shape="round" color="#000000">{{ item.remark }} 积分</TTag>
          </template>
        </TCard>
      </div>
    </TCard>
    <TRadioGroup v-model="tab" theme="button" class="mt-6!" variant="primary-filled">
      <TRadioButton v-for="item in tabs" :key="item.value" :value="item.value">
        <div class="flex items-center">
          <Icon :icon="item.icon" size="20" />
          <span class="ml-2">{{ item.label }}</span>
        </div>
      </TRadioButton>
    </TRadioGroup>
    <TTabs :model-value="tab" class="overflow-visible!">
      <TTabPanel v-for="item in tabs" :key="item.value" :value="item.value" :label="item.label">
        <Component :is="item.component" class="mt-4!" v-bind="item.props"></Component>
      </TTabPanel>
    </TTabs>
  </TCard>
</template>

<style scoped>
:deep(.t-tabs__header) {
  display: none;
}
</style>
