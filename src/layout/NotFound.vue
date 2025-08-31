<script setup lang="ts">
import notFound from 'img/404.png'

const router = useRouter()

function toIndex(): void {
  router.push({
    name: 'Index',
  })
}
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center">
    <img style="width: 500px" :src="notFound" />
    <TButton class="!mt-8" @click="toIndex">返回首页</TButton>
  </div>
</template>
