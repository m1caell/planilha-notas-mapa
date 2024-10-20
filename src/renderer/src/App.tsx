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
      alert('Você deve digitar um arquivo NF-e.')
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
    <div className="w-screen h-screen flex justify-center overflow-y-scroll">
      <main className="px-5 py-4 max-w-[1200px]">
        <h1 className="text-4xl mb-8 text-center">Planilha Notas Mapa</h1>

        <section className="flex justify-between gap-8 pb-5">
          <aside className="flex-1">
            <Input
              label="Aba"
              name="sheetName"
              onChange={(e) => setFilePath((prev) => ({ ...prev, sheetName: e.target.value }))}
              className="mb-6"
              placeholder="Ex.: Janeiro - 2024"
              value={filePath.sheetName}
            />

            <InputFile
              label="NF-e"
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

            <div className="relative pb-6">
              <Button onClick={handleSelectFolder} className="w-full">
                Selecionar diretório de notas fiscais
              </Button>
              {filePath.nfeDirectory && (
                <p
                  title={filePath.nfeDirectory}
                  className="mt-2 text-sm text-gray-400 absolute bottom-0 w-full whitespace-nowrap text-ellipsis overflow-hidden"
                >
                  <strong>Arquivo:</strong> {filePath.nfeDirectory}
                </p>
              )}
            </div>
          </aside>
          <aside className="flex-1">
            <h2 className="text-lg">
              <strong>Tutorial</strong>
            </h2>
            <p>
              Esse programa tem por objetivo converter arquivos de texto (txt, csv) em um arquivo
              Excel, abaixo segue explicação de cada campo do formulário que deve ser preenchido.
            </p>

            <p>
              <strong>Nome: </strong>
              <span>
                esse campo é obrigatório e ele vai dar nome ao Excel após o processamento.
              </span>
            </p>
            <p>
              <strong>Aba: </strong>
              <span>
                esse campo é obrigatório e ele vai dar nome a nova aba dentro do arquivo Excel.
              </span>
            </p>
            <p>
              <strong>NF-e: </strong>
              <span>
                esse campo é obrigatório e ele deve ser um arquivo de texto (txt, csv) que contém os
                números das notas fiscais.
              </span>
            </p>
            <p>
              <strong>Excel: </strong>
              <span>
                esse campo é opcional, caso seja preenchido o arquivo Excel selecionado será
                editado, caso não seja preenchido será criado um novo arquivo Excel. Outro ponto
                importante aqui é cuidar para esse arquivo não estar aberto em outro programa.
              </span>
            </p>
            <p className="mb-14">
              <strong>Diretório de notas fiscais: </strong>
              <span>
                esse campo é opcional, quando selecionado a pasta o programa vai tentar filtrar pelo
                nome da nota fiscal
              </span>
            </p>

            <Button onClick={handleConvert} className="w-full bg-purple-600">
              Processar
            </Button>
          </aside>
        </section>

        <footer className="flex justify-center">
          <Versions></Versions>
        </footer>
      </main>
    </div>
  )
}

export default App
