import { useState } from 'react'
import Versions from './components/Versions'
import { InputFile } from './components/InputFile'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { FilePathState } from './types/filepath-state'

function App(): JSX.Element {
  const [filePath, setFilePath] = useState<FilePathState>({
    sheetName: '',
    nfeFilePath: '',
    xlsxFilePath: ''
  })
  const [result, setResult] = useState('')

  const handleFileChange = (name: string, file: File): void => {
    setResult('')

    setFilePath((prevState) => ({
      ...prevState,
      [name]: file.path
    }))
  }

  const handleConvert = async (): Promise<void> => {
    if (!filePath.nfeFilePath) {
      alert('Você deve selecionar um arquivo Nfe válido.')
      return
    }

    if (!filePath.sheetName) {
      alert('Você deve selecionar um nome para aba.')
      return
    }

    try {
      const response = await window.api.convertTextToXlsx(filePath)

      if (response.success) {
        setResult(`Xlsx gerado com sucesso! Salvo em: ${response.xlsxFilePath}`)
        setFilePath({
          sheetName: '',
          nfeFilePath: '',
          xlsxFilePath: ''
        })
      } else {
        setResult(`Falha ao gerar arquivo: ${response.error}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`)
      }
    }
  }

  return (
    <>
      <h1 className="text-4xl mb-8">Planilha Notas Mapa</h1>

      <div className="flex w-full gap-4 pb-4">
        <InputFile
          label="Nfe"
          name="nfeFilePath"
          acceptFiles=".txt,.csv"
          onChange={(file) => handleFileChange('nfeFilePath', file)}
          className="mb-4 w-80"
          selectedFile={filePath.nfeFilePath}
        />
        <InputFile
          label="Excel"
          name="xlsxFilePath"
          acceptFiles=".xlsx,.xls"
          onChange={(file) => handleFileChange('xlsxFilePath', file)}
          className="mb-4 w-80"
          selectedFile={filePath.xlsxFilePath}
        />
      </div>

      <div className="flex flex-col w-full">
        <Input
          label="Nome aba"
          name="sheetName"
          onChange={(e) => setFilePath((prev) => ({ ...prev, sheetName: e.target.value }))}
          className="mb-8 w-80"
          placeholder="Ex.: Janeiro - 2024"
          value={filePath.sheetName}
        />

        <Button onClick={handleConvert} className="w-full">
          Processar
        </Button>

        {result && <p className="mt-4 p-2">{result}</p>}
      </div>

      <Versions></Versions>
    </>
  )
}

export default App
