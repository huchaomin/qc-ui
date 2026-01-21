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

export { getFilenameFromUrl }
