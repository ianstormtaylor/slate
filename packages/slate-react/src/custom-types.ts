import { CustomTypes } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Text: {
      placeholder: string
    }
  }
}
