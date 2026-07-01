type OptionGroupProps = {
  title: string
  options: string[]
  value: string | null
  onSelect: (option: string) => void
}


export function OptionGroup({ title, options, value, onSelect }: OptionGroupProps) {
  const buttons = options.map((option) => {
    const isSelected = option === value

    return (
      <button
        type="button"
        key={option}
        onClick={() => onSelect(option)}
        className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
          isSelected
            ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
            : "bg-slate-700/80 text-slate-100 hover:bg-slate-600"
        }`}
      >
        {option}
      </button>
    )
  })

  return (
    <section className="space-y-3">
      <h3 className="text-base font-bold leading-tight text-slate-100">{title}</h3>
      <div className="flex flex-wrap gap-2">{buttons}</div>
    </section>
  )
}
