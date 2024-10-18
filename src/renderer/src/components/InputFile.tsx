import { useEffect, useRef, useState } from 'react'

type InputFileProps = {
  label: string
  name: string
  acceptFiles: string
  onChange: (file: File) => void
  className?: string
  selectedFile: string
}

export function InputFile({
  label,
  name,
  acceptFiles,
  onChange,
  className,
  selectedFile
}: InputFileProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedFile === '' && ref.current) {
      ref.current.value = ''
    }
  }, [selectedFile, ref])

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (): void => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragging(false)
    const files = event.dataTransfer.files

    if (files && files.length > 0) {
      onChange(files[0])
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      onChange(event.target.files[0])
    }
  }

  return (
    <div className={`flex flex-col cursor-pointer ${className}`}>
      <label className="mb-2 text-xl" htmlFor={`${name}-id`}>
        {label}
      </label>
      <div
        className={`border-2 border-dashed p-4 rounded ${isDragging ? 'border-blue-500' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="mb-2">Arraste ou clique no botão de busca</p>
        <input
          ref={ref}
          className="hidden"
          id={`${name}-id`}
          name={name}
          type="file"
          accept={acceptFiles}
          onChange={handleFileChange}
        />
        <label
          htmlFor={`${name}-id`}
          className="
            text-center
            cursor-pointer
            p-2
            rounded
          bg-gray-500
          hover:bg-gray-400
          active:bg-gray-600
            min-w-52
          outline-black
          "
        >
          Procurar arquivo
        </label>
      </div>
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-700">
          <strong>Arquivo:</strong> {selectedFile}
        </p>
      )}
    </div>
  )
}
