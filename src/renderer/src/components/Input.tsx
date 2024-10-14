type InputProps = {
  label: string
  name: string
  value: string
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function Input({
  label,
  name,
  value,
  onChange,
  className,
  placeholder
}: InputProps): JSX.Element {
  return (
    <div className={`flex flex-col cursor-pointer ${className}`}>
      <label className="mb-2 text-xl" htmlFor={`${name}-id`}>
        {label}
      </label>
      <input
        className="border text-black outline-black p-1"
        id={`${name}-id`}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
