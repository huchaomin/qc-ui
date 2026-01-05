<script setup lang="ts">
import type { FormPropsType } from '@/components/tDesignReset/TForm.vue'
import PageSearch from './PageSearch.vue'

export interface PageListConfigType {
  formProps: FormPropsType
}

const props = withDefaults(defineProps<PageListConfigType>(), {})
</script>

<template>
  <TCard>
    <PageSearch v-bind="props.formProps"></PageSearch>
  </TCard>
</template>
