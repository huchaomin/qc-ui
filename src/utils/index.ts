function getFilenameFromUrl(url: string, withExt: boolean = false): string {
  const name = (url.split('/').pop() ?? '').split('?')[0]

  if (withExt) {
    return name
  }
  else {
    const arr = name.split('.')
    arr.pop()
    return arr.join('.')
  }
}

function isFalsy(val: any): boolean {
  // 0 和 false 是合法值
  return ['', null, undefined].includes(val as null | string | undefined) || Number.isNaN(val)
}

export { getFilenameFromUrl, isFalsy }
