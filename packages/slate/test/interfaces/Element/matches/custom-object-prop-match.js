import { Element } from 'slate'

const targetProp = { someKey: 'foo' }

const searchProp = { someKey: 'foo' }

export const input = {
  element: { children: [], type: 'bold', prop: targetProp },
  props: { type: 'bold', prop: searchProp },
}

export const test = ({ element, props }) => {
  return Element.matches(element, props)
}

export const output = true
