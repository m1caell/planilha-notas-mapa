import { PropsWithChildren } from 'react'

type ButtonProps = {
  onClick: () => void
  className?: string
} & PropsWithChildren
export function Button({ onClick, children, className }: ButtonProps): JSX.Element {
  return (
    <button
      className={`
          p-4 bg-gray-500
        hover:bg-gray-400
        active:bg-gray-600
        min-w-52
        outline-black
        rounded
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
