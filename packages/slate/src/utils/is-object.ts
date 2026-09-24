export const isObject = (value: any): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null
