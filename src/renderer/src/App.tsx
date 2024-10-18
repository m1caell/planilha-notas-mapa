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
    xlsxFilePath: '',
    nfeDirectory: ''
  })

  const handleFileChange = (name: string, file: File): void => {
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
        const message =
          response.nfeErrors.length > 0
            ? `
          Xlsx gerado com sucesso! Salvo em: ${response.xlsxFilePath}

          NF-e não encontrada(s): ${response.nfeErrors.join(', ')}
        `
            : `Xlsx gerado com sucesso! Salvo em: ${response.xlsxFilePath}`

        alert(message)

        setFilePath({
          sheetName: '',
          nfeFilePath: '',
          xlsxFilePath: '',
          nfeDirectory: ''
        })
      } else {
        alert(`Falha ao gerar arquivo: ${response.error}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      }
    }
  }

  const handleSelectFolder = async (): Promise<void> => {
    const folder = await window.api.selectFolder()

    if (folder) {
      setFilePath((prevState) => ({
        ...prevState,
        nfeDirectory: folder
      }))
    }
  }

  return (
    <main className="w-screen h-screen px-5 py-4 overflow-y-scroll">
      <h1 className="text-4xl mb-8 text-center">Planilha Notas Mapa</h1>

      <section className="flex justify-between gap-5">
        <aside className="flex-1">
          <Input
            label="Nome aba"
            name="sheetName"
            onChange={(e) => setFilePath((prev) => ({ ...prev, sheetName: e.target.value }))}
            className="mb-2"
            placeholder="Ex.: Janeiro - 2024"
            value={filePath.sheetName}
          />

          <InputFile
            label="Nfe"
            name="nfeFilePath"
            acceptFiles=".txt,.csv"
            onChange={(file) => handleFileChange('nfeFilePath', file)}
            className="mb-2"
            selectedFile={filePath.nfeFilePath}
          />

          <InputFile
            label="Excel"
            name="xlsxFilePath"
            acceptFiles=".xlsx,.xls"
            onChange={(file) => handleFileChange('xlsxFilePath', file)}
            className="mb-4"
            selectedFile={filePath.xlsxFilePath}
          />

          <div>
            <Button onClick={handleSelectFolder} className="w-full">
              Selecionar diretório de notas fiscais
            </Button>
            {filePath.nfeDirectory && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Arquivo:</strong> {filePath.nfeDirectory}
              </p>
            )}
          </div>
        </aside>
        <aside className="flex-1 pt-8">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis doloremque et ipsam
            saepe nobis, ut, expedita quod reiciendis deserunt id numquam corrupti quibusdam minima.
            Officiis molestias eos minus quibusdam odio.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis doloremque et ipsam
            saepe nobis, ut, expedita quod reiciendis deserunt id numquam corrupti quibusdam minima.
            Officiis molestias eos minus quibusdam odio.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis doloremque et ipsam
            saepe nobis, ut, expedita quod reiciendis deserunt id numquam corrupti quibusdam minima.
            Officiis molestias eos minus quibusdam odio.
          </p>
        </aside>
      </section>
      <section className="mt-8 flex justify-center">
        <Button onClick={handleConvert} className="w-fit bg-purple-600">
          Processar
        </Button>
      </section>

      <footer className="flex justify-end">
        <Versions></Versions>
      </footer>
    </main>
  )
}

export default App
