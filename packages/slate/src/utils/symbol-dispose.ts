export const getSymbolDispose = (): typeof Symbol.dispose =>
  Symbol.dispose ?? (Symbol.for('Symbol.dispose') as typeof Symbol.dispose)
