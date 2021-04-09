import { Text } from 'slate'
import { isBoldText } from './type-guards'

export const input: Text = {
  placeholder: 'heading',
  bold: false,
  italic: false,
  text: 'mytext',
}

export const test = isBoldText

export const output = false
