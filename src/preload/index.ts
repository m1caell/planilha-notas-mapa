import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface FilePathState {
  sheetName: string
  nfeFilePath: string
  xlsxFilePath: string
}

interface ConvertCsvToXlsxResponse {
  success: boolean
  xlsxFilePath?: string
  error?: string
}

export interface Api {
  convertTextToXlsx(filePath: FilePathState): Promise<ConvertCsvToXlsxResponse>
}

// Custom APIs for renderer
const api = {
  convertTextToXlsx: (filePath: FilePathState): Promise<ConvertCsvToXlsxResponse> => {
    return ipcRenderer.invoke('convert-text-to-xlsx', filePath)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
