// show that regular methods that are imported work as expected
import { Text } from 'slate'
import { CustomText } from './custom-types'

export const input: Text = {
  placeholder: 'mystring',
  text: 'mytext',
}

export const test = (text: Text): text is CustomText => {
  return !!(text as CustomText).placeholder
}

export const output = true
