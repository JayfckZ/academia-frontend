import { forwardRef } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CustomProps>(
  function CurrencyInput(props, ref) {
    const { onChange, ...other } = props
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({ target: { name: props.name, value: values.value } })
        }}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
      />
    )
  }
)

export const CpfInput = forwardRef<HTMLInputElement, CustomProps>(
  function CpfInput(props, ref) {
    const { onChange, ...other } = props
    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        format="###.###.###-##"
        onValueChange={(values) => {
          onChange({
            target: { name: props.name, value: values.formattedValue }
          })
        }}
      />
    )
  }
)

export const PhoneInput = forwardRef<HTMLInputElement, CustomProps>(
  function PhoneInput(props, ref) {
    const { onChange, ...other } = props
    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        format="(##) #####-####"
        onValueChange={(values) => {
          onChange({
            target: { name: props.name, value: values.formattedValue }
          })
        }}
      />
    )
  }
)

export const formatCpf = (v: string) => {
  if (!v) return ''
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatPhone = (v: string) => {
  if (!v) return ''
  return v.length === 11
    ? v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}
