<script setup lang="ts">
const url = Object.values(
  import.meta.glob('img/login.*', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)[0] as string
const logoUrl = Object.values(
  import.meta.glob('img/logo.*', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)[0] as string
</script>

<template>
  <div
    class="relative flex h-full items-center justify-center"
    style="background: linear-gradient(159deg, #baccf6 0%, #fff 43%, #fff 61%, #baccf6 100%)"
  >
    <div class="bg_inner flex items-stretch justify-between">
      <TImage class="left_banner" :src="url" style="transform: scale(1.4)"></TImage>
      <TCard class="login_form_wrapper shrink-0 px-4!" :body-full-height="true">
        <slot></slot>
      </TCard>
    </div>
    <TImage :src="logoUrl" class="logo"></TImage>
  </div>
</template>

<style scoped>
.logo {
  position: absolute;
  top: 25px;
  left: 25px;
  max-width: 200px;
  max-height: 100px;
}

.bg_inner {
  width: calc(12% + 860px);
  height: 450px;
}

.login_form_wrapper {
  width: 430px;
}

@media screen and (width <= 1100px) {
  .left_banner {
    display: none;
  }

  .bg_inner {
    justify-content: center;
  }
}
</style>
