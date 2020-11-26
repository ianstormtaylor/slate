import { Text } from 'slate'
import { isCustomText } from './type-guards'

export const input: Text = {
  bold: true,
  text: 'mytext',
}

export const test = isCustomText

export const output = false
