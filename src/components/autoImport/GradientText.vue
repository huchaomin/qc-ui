<script setup lang="ts">
interface GradientTextProps {
  animationSpeed?: number
  className?: string
  colors?: string[]
  showBorder?: boolean
  text: string
}
const {
  animationSpeed = 8,
  className = '',
  colors = ['#0052d9', '#4472bd', '#8791a1'],
  showBorder = false,
} = defineProps<GradientTextProps>()
const gradientStyle = computed(() => ({
  '--animation-duration': `${animationSpeed}s`,
  animationDuration: `${animationSpeed}s`,
  backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
  backgroundSize: '300% 100%',
}))
const borderStyle = computed(() => ({
  ...gradientStyle.value,
}))
const textStyle = computed(() => ({
  ...gradientStyle.value,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
}))
</script>

<template>
  <div
    :class="`relative mx-auto flex max-w-fit flex-row items-center justify-center overflow-hidden font-medium backdrop-blur transition-shadow duration-500 ${className}`"
  >
    <div
      v-if="showBorder"
      class="animate_gradient pointer-events-none absolute inset-0 z-0 bg-cover"
      :style="borderStyle"
    >
      <div
        class="absolute inset-0 z-[-1] rounded-[1.25rem] bg-black"
        style="
          top: 50%;
          left: 50%;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          transform: translate(-50%, -50%);
        "
      />
    </div>

    <div
      class="animate_gradient relative z-2 inline-block bg-cover text-transparent"
      :style="textStyle"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate_gradient {
  animation: gradient var(--animation-duration, 8s) linear infinite;
}
</style>
