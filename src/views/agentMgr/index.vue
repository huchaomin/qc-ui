<script setup lang="ts">
const router = useRouter()
const brandId = ref('')
const brandOptions = useList('brand')
const status = ref('')
const statusOptions = ref([
  {
    label: '全部',
    value: '',
  },
  {
    label: '生效',
    value: '0',
  },
  {
    label: '未生效',
    value: '1',
  },
])

watchEffect(() => {
  brandId.value = brandOptions.value[0]?.value ?? ''
})

const { data } = useWatcher(
  () =>
    alovaInst.Get<Array<Record<string, any>>>('yq/agentManage/getList', {
      params: {
        brandId: brandId.value,
        status: status.value,
      },
    }),
  [brandId, status],
  {
    immediate: true,
    initialData: [],
    middleware: async (_, next) => {
      if (!isFalsy(brandId.value)) {
        next()
      }
    },
  },
)

function handleAdd(): void {
  router.push({
    name: 'AddAgent',
    query: {
      brandId: brandId.value,
    },
  })
}

function handleEdit(id: string): void {
  router.push({
    name: 'EditAgent',
    query: {
      brandId: brandId.value,
      id,
    },
  })
}

function handleView(id: string): void {
  router.push({
    name: 'ViewAgent',
    query: {
      brandId: brandId.value,
      id,
    },
  })
}
</script>

<template>
  <TCard body-full-height class="h-full" body-class-name="!flex flex-col overflow-y-auto">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center">
          品牌：<TSelect
            v-model="brandId"
            options="brand"
            class="w-fit!"
            :clearable="false"
          ></TSelect>
        </div>
        <TRadioGroup v-model="status" :options="statusOptions" theme="button"></TRadioGroup>
      </div>
    </template>
    <TList class="-m-3! p-3!">
      <TListItem v-for="(item, index) in [{}, ...data]" :key="item.id">
        <template #default>
          <TButton
            v-if="index === 0"
            class="min-h-[117px]"
            :class="{
              'absolute! top-0 bottom-0 h-auto!': data.length > 0,
            }"
            variant="dashed"
            theme="default"
            block
            @click="handleAdd"
          >
            新增
          </TButton>
          <TCard
            v-else
            class="w-full"
            :title="item.agentName"
            :subtitle="item.agentDesc"
            title-ellipsis
            :header-bordered="false"
            header-class-name="pb-0!"
          >
            <template #actions>
              <TButton theme="default" size="small" @click="handleEdit(item.id)"> 修改 </TButton>
              <TButton theme="default" size="small" @click="handleView(item.id)"> 查看 </TButton>
            </template>
            <div
              class="grid grid-cols-[auto_auto] gap-x-2! gap-y-1! text-sm! text-(--td-text-color-placeholder)"
            >
              <div>创建人：{{ item.createBy }}</div>
              <div style="justify-self: end">创建时间：{{ item.createTime }}</div>
              <div>最近更新人：{{ item.updateBy }}</div>
              <div style="justify-self: end">更新时间：{{ item.updateTime }}</div>
            </div>
          </TCard>
        </template>
      </TListItem>
    </TList>
  </TCard>
</template>

<style scoped>
:deep() {
  .t-list-item {
    padding: 0;
  }

  .t-list__inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;
  }
}
</style>
