import { BaseRange, BaseText } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Text: {
      placeholder: string
    } & BaseText
    Range: {
      placeholder?: string
    } & BaseRange
  }
}
