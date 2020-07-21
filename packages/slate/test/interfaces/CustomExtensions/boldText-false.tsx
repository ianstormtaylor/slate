// show that regular methods that are imported work as expected
import { Text } from 'slate'
import { BoldCustomText } from './custom-types'

export const input: Text = {
  placeholder: 'heading',
  text: 'mytext',
}

export const test = (text: Text): text is BoldCustomText => {
  return !!(text as BoldCustomText).bold
}

export const output = false
