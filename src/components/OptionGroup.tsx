type OptionGroupProps = {
  title: string
  options: string[]
  onSelect:(optoin: string) => void
}


export function OptionGroup({title, options, onSelect}: OptionGroupProps){
    const buttons = options.map(option =>{
        return (
            
            <>
            <button type="button" key={option} onClick={() => onSelect(option)}>
              {option}
            </button>
            </>
        )
    })
    return (
        <div>
            <h3>{title}</h3>
            {buttons}
        </div>  
    )
}