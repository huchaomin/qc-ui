interface TreeNode {
  [key: string]: any
  children?: TreeNode[]
}

/**
 * 将扁平数组转换为树形结构
 * @param data 扁平数据数组
 * @param options 配置选项
 * @param options.childrenKey 子节点键名
 * @param options.idKey 节点ID键名
 * @param options.parentKey 节点父ID键名
 * @param options.rootParentId 根节点ID键名
 * @returns 树形结构数组
 */
function flatArrToTree(
  data: Record<string, any>[],
  options: {
    childrenKey?: string
    idKey?: string
    parentKey?: string
    rootParentId?: null | string
  } = {},
): TreeNode[] {
  const {
    childrenKey = 'children',
    idKey = 'id',
    parentKey = 'parentId',
    rootParentId = null,
  } = options

  // 1. 参数校验
  if (!Array.isArray(data)) {
    throw new TypeError('flatArrToTree: 输入参数 data 必须是数组')
  }

  if (data.length === 0) {
    return []
  }

  const result: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  // 2. 第一遍：创建所有节点的引用
  for (const item of data) {
    const idValue = item[idKey] as string

    if (idValue == null) {
      console.warn(`flatArrToTree: 数据项缺少 ${idKey} 属性`, item)
      continue
    }

    // 复制对象，避免修改原数据
    const node: TreeNode = { ...item, children: [] }

    if (map.has(idValue)) {
      console.warn(`flatArrToTree: 检测到重复的 ${idKey}: ${idValue}`)
    }

    map.set(idValue, node)
  }

  // 3. 第二遍：建立父子关系
  for (const [_, node] of map) {
    const parentId = node[parentKey] as string
    // 判断是否为根节点
    const isRoot = parentId == null || parentId === rootParentId || !map.has(parentId)

    if (isRoot) {
      result.push(node)
    } else {
      const parent = map.get(parentId)!

      ;(parent[childrenKey] as TreeNode[]).push(node)
    }
  }

  return result
}

/**
 * @description: 从 url 中获取文件名
 * @param {string} url
 * @param {boolean} withExt 是否包含扩展名
 * @return {string}
 */
function getFilenameFromUrl(url: string, withExt = false): string {
  const name = url.split('/').pop()!.split('?')[0]!

  if (withExt) {
    return name
  } else {
    const arr = name.split('.')

    arr.pop()
    return arr.join('.')
  }
}

export { flatArrToTree, getFilenameFromUrl }
