import { dialog } from 'electron'

export async function selectFolder(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  if (result.filePaths.length > 0) {
    return result.filePaths[0]
  } else {
    return null
  }
}
