import { Text, Range } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Text: {
      placeholder: string
    }
    Range: {
      placeholder?: string
    }
  }
}
