import { Text } from 'slate'
import { isBoldText } from './type-guards'

export const input: Text = {
  placeholder: 'heading',
  text: 'mytext',
}

export const test = isBoldText

export const output = false
