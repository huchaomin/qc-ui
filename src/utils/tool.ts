import type FileSaver from 'file-saver'

async function saveAs(arg1: Parameters<typeof FileSaver.saveAs>[0], arg2: Parameters<typeof FileSaver.saveAs>[1], arg3?: FileSaver.FileSaverOptions): Promise<void> {
  const { default: save } = await import('file-saver')
  save(arg1, arg2, arg3)
}

export { saveAs }
