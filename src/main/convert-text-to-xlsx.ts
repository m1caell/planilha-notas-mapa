import * as fs from 'node:fs/promises'
import * as xlsx from 'xlsx'

export interface FilePathState {
  sheetName: string
  nfeFilePath: string
  xlsxFilePath: string
  nfeDirectory: string
}

interface ConvertCsvToXlsxResponse {
  success: boolean
  error: string | null
  xlsxFilePath?: string
  nfeErrors: string[]
}

export async function convertTextToXlsx(
  _event,
  filePath: FilePathState
): Promise<ConvertCsvToXlsxResponse> {
  try {
    const { nfeFilePath, xlsxFilePath, sheetName, nfeDirectory } = filePath
    let loadedWorkbook: xlsx.WorkBook | undefined

    if (!nfeFilePath || !sheetName) {
      throw new Error('nfeFilePath and sheetName are required')
    }

    const csvData = await fs.readFile(nfeFilePath, 'utf-8')
    const csvRows = csvData.split('\n')
    const filterResult = await filterNfeFilesFromFolder(nfeDirectory, csvRows)

    if (xlsxFilePath) {
      loadedWorkbook = xlsx.readFile(xlsxFilePath)
      editXlsxFile(filterResult.csvData, loadedWorkbook, xlsxFilePath, sheetName)

      return { success: true, xlsxFilePath, error: null, nfeErrors: filterResult.nfeErrors }
    }

    if (!xlsxFilePath) {
      const xlsxFilePath = nfeFilePath.replace(/.(csv|txt)/g, '.xlsx')
      createNewXlsxFile(filterResult.csvData, sheetName, xlsxFilePath)

      return { success: true, xlsxFilePath, error: null, nfeErrors: filterResult.nfeErrors }
    }
  } catch (error) {
    console.error('Erro no processamento:', error)

    if (error instanceof Error) {
      return { success: false, error: error.message, nfeErrors: [] }
    } else {
      return { success: false, error: 'An unknown error occurred', nfeErrors: [] }
    }
  }

  return { success: false, error: 'No valid file path provided', nfeErrors: [] }
}

function editXlsxFile(
  csvData: string[],
  workbook: xlsx.WorkBook,
  xlsxFilePath: string,
  sheetName: string
): void {
  const newWorksheet = xlsx.utils.aoa_to_sheet(csvData.map((row) => row.split(';')))

  xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName)
  xlsx.writeFile(workbook, xlsxFilePath)
}

async function createNewXlsxFile(
  csvData: string[],
  sheetName: string,
  xlsxFilePath: string
): Promise<void> {
  const newWorkbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.aoa_to_sheet(csvData.map((row) => row.split(';')))

  xlsx.utils.book_append_sheet(newWorkbook, worksheet, sheetName)
  xlsx.writeFile(newWorkbook, xlsxFilePath)
}

async function getNameFilesFromFolderPath(folderPath: string): Promise<string[]> {
  const files = await fs.readdir(folderPath)
  const nfeNumbers = files.map((file) => file.split(' ')[0])

  return nfeNumbers
}

const NUMBER_CSV_COLUMN = 12
async function filterNfeFilesFromFolder(
  folderPath: string,
  csvData: string[]
): Promise<{ csvData: string[]; nfeErrors: string[] }> {
  if (!folderPath) return { csvData, nfeErrors: [] }

  const [firstRow] = csvData
  const files = await getNameFilesFromFolderPath(folderPath)
  const nfeErrors: string[] = []
  const csvDataFiltered = csvData.filter((row) => {
    const rowSplited = row.split(';')
    const nfeNumber = rowSplited[NUMBER_CSV_COLUMN]

    if (!Number(nfeNumber)) return false

    const fileExists = files.some((file) => file.includes(nfeNumber))

    if (fileExists) {
      return true
    } else {
      nfeErrors.push(nfeNumber)
      return false
    }
  })

  csvDataFiltered.unshift(firstRow)

  return { csvData: csvDataFiltered, nfeErrors }
}
