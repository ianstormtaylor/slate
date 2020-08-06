import { Element } from 'slate'

export const input = {
  element: { children: [], type: 'bold' },
  props: { type: 'bold' },
}
export const test = ({ element, props }) => {
  return Element.matches(element, props)
}
export const output = true
