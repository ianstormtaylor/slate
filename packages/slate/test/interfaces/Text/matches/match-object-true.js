import { Text } from 'slate'

const targetProp = { match: 'foo' }
const searchProp = { match: 'foo' }

export const input = {
  text: { text: '', bold: true, prop: targetProp },
  props: { prop: searchProp },
}

export const test = ({ text, props }) => {
  return Text.matches(text, props)
}

export const output = true
