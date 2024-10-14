import * as fs from 'node:fs/promises'
import * as xlsx from 'xlsx'

export interface FilePathState {
  sheetName: string
  nfeFilePath: string
  xlsxFilePath: string
}

interface ConvertCsvToXlsxResponse {
  success: boolean
  error: string | null
  xlsxFilePath?: string
}

export async function convertTextToXlsx(
  _event,
  filePath: FilePathState
): Promise<ConvertCsvToXlsxResponse> {
  try {
    const { nfeFilePath, xlsxFilePath, sheetName } = filePath
    let loadedWorkbook: xlsx.WorkBook | undefined

    if (!nfeFilePath || !sheetName) {
      throw new Error('nfeFilePath and sheetName are required')
    }

    const csvData = await fs.readFile(nfeFilePath, 'utf-8')

    if (xlsxFilePath) {
      loadedWorkbook = xlsx.readFile(xlsxFilePath)
      editXlsxFile(csvData, loadedWorkbook, xlsxFilePath, sheetName)

      return { success: true, xlsxFilePath, error: null }
    }

    if (!xlsxFilePath) {
      const xlsxFilePath = nfeFilePath.replace(/.(csv|txt)/g, '.xlsx')
      createNewXlsxFile(csvData, sheetName, xlsxFilePath)

      return { success: true, xlsxFilePath, error: null }
    }
  } catch (error) {
    console.error('Erro no processamento:', error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    } else {
      return { success: false, error: 'An unknown error occurred' }
    }
  }

  return { success: false, error: 'No valid file path provided' }
}

function editXlsxFile(
  csvData: string,
  workbook: xlsx.WorkBook,
  xlsxFilePath: string,
  sheetName: string
): void {
  const newWorksheet = xlsx.utils.aoa_to_sheet(csvData.split('\n').map((row) => row.split(';')))
  xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName)
  const getVersionFile = xlsxFilePath.split('.')[0].substring(xlsxFilePath.length - 3)

  console.log(getVersionFile)
  xlsx.writeFile(workbook, xlsxFilePath)
}

function createNewXlsxFile(csvData: string, sheetName: string, xlsxFilePath: string): void {
  const newWorkbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.aoa_to_sheet(csvData.split('\n').map((row) => row.split(';')))

  xlsx.utils.book_append_sheet(newWorkbook, worksheet, sheetName)

  xlsx.writeFile(newWorkbook, xlsxFilePath)
}
