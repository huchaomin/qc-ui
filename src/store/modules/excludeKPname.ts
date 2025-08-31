export default defineStore('excludeKPname', () => {
  const excludeKPname: string[] = reactive([]) // 不缓存的路由name    return {

  function clear(): void {
    excludeKPname.length = 0
  }

  function add(name: string): void {
    excludeKPname.push(name)
  }

  function remove(name: string): void {
    const index = excludeKPname.findIndex((item) => item === name)

    if (index !== -1) {
      excludeKPname.splice(index, 1)
    }
  }

  return {
    add,
    clear,
    excludeKPname,
    remove,
  }
})
