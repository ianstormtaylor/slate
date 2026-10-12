import { Text } from 'slate'

export const input = {
  textNodeA: { text: 'same text', bold: true },
  textNodeB: { text: 'same text', bold: true, italic: true },
}

export const test = ({ textNodeA, textNodeB }) => {
  return Text.equals(textNodeA, textNodeB, { loose: false })
}

export const output = false
