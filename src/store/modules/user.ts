export default defineStore(
  'user',
  () => {
    const token = ref('')

    function clearSession() {}

    return {
      clearSession,
      token,
    }
  },
  {
    persist: {
      pick: ['token'],
    },
  },
)
