<script setup lang="ts">
import type { Ref } from 'vue'
import BrandVideoList from '@/views/dataCenter/brandVideoList/index.vue'

const data = inject<Ref<Record<string, any> | undefined>>('data')!
</script>

<template>
  <BrandVideoList
    v-if="data"
    :is-in-cluster-data-detail="true"
    :publish-time="[data!.publishTimeStart, data!.publishTimeEnd]"
    :brand-id="data!.brandId"
  ></BrandVideoList>
</template>
