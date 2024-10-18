import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface FilePathState {
  sheetName: string
  nfeFilePath: string
  xlsxFilePath: string
  nfeDirectory: string
}

interface ConvertCsvToXlsxResponse {
  success: boolean
  xlsxFilePath?: string
  error?: string
  nfeErrors: string[]
}

export interface Api {
  convertTextToXlsx(filePath: FilePathState): Promise<ConvertCsvToXlsxResponse>
  selectFolder(): Promise<string | null>
}

// Custom APIs for renderer
const api = {
  convertTextToXlsx: (filePath: FilePathState): Promise<ConvertCsvToXlsxResponse> => {
    return ipcRenderer.invoke('convert-text-to-xlsx', filePath)
  },
  selectFolder: (): Promise<string | null> => {
    return ipcRenderer.invoke('select-folder')
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
