const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const toCurrency = (value: number, inCents = true) => {
  return currencyFormatter.format(inCents ? value / 100 : value)
}
