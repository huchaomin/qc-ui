import type FileSaver from 'file-saver'

const aesKey = 'XwKsGlMcdPMEhR1B'

async function aesDecrypt(
  word: string,
  keyWord: string = aesKey,
): Promise<string> {
  const { default: CryptoJS } = await import('crypto-js')
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const decrypted = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

async function aesEncrypt(
  word: string,
  keyWord: string = aesKey,
): Promise<string> {
  const { default: CryptoJS } = await import('crypto-js')
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

async function saveAs(
  arg1: Parameters<typeof FileSaver.saveAs>[0],
  arg2: Parameters<typeof FileSaver.saveAs>[1],
  arg3?: FileSaver.FileSaverOptions,
): Promise<void> {
  const { default: save } = await import('file-saver')
  save(arg1, arg2, arg3)
}

export { aesDecrypt, aesEncrypt, saveAs }
