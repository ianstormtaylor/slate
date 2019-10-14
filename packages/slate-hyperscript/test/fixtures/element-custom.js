/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    paragraph: { type: 'paragraph' },
  },
})

export const input = <paragraph>word</paragraph>

export const output = {
  type: 'paragraph',
  nodes: [
    {
      text: 'word',
      marks: [],
    },
  ],
}
