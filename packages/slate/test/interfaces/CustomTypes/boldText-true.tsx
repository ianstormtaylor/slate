// show that regular methods that are imported work as expected
import { Text } from 'slate'
import { isBoldText } from './type-guards'

export const input: Text = {
  bold: true,
  text: 'mytext',
}

export const test = isBoldText

export const output = true
