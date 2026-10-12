import { Text } from 'slate'

export const input = {
  textNodeA: { text: 'some text', bold: true },
  textNodeB: { text: 'diff text', bold: true },
}

export const test = ({ textNodeA, textNodeB }) => {
  return Text.equals(textNodeA, textNodeB, { loose: true })
}

export const output = true
