import { Element } from 'slate'

const targetProp = {
  deeply: {
    nested: {
      match: 'foo',
    },
  },
}

const searchProp = {
  deeply: {
    nested: {
      match: 'bar',
    },
  },
}

export const input = {
  element: { children: [], type: 'bold', prop: targetProp },
  props: { type: 'bold', prop: searchProp },
}

export const test = ({ element, props }) => {
  return Element.matches(element, props)
}

export const output = false
