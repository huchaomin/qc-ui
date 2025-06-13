<script setup lang="ts">
import notFound from '@/assets/images/404.png'

const router = useRouter()

function toIndex(): void {
  router.push({
    name: 'Index',
  })
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <img style="width: 500px;" :src="notFound" />
    <TButton class="mt-8" @click="toIndex">返回首页</TButton>
  </div>
</template>
