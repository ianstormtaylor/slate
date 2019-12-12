import { Text } from 'slate'

export const input = {
  text: { text: '', bold: { active: true } },
  props: { italic: { active: true } },
}

export const test = ({ text, props }) => {
  return Text.matches(text, props)
}

export const output = false
