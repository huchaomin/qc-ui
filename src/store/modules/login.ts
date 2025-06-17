export default defineStore(
  'login',
  () => {
    const username = ref('')
    const password = ref('')
    const rememberMe = ref(true)
    return {
      password,
      rememberMe,
      username,
    }
  },
  {
    persist: {
      pick: ['username', 'password', 'rememberMe'],
      storage: localStorage,
    },
  },
)
