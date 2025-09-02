export default defineStore(
  'common',
  () => {
    const drawerOpen = ref(true)
    return {
      drawerOpen,
    }
  },
  {
    persist: {
      pick: ['drawerOpen'],
    },
  },
)
