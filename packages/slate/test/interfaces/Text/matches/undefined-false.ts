import { Text } from 'slate'

export const input = {
  text: { foo: undefined },
  props: { bar: undefined },
}

export const test = ({ text, props }) => {
  return Text.matches(text, props)
}

export const output = false
