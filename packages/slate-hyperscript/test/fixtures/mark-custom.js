/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  marks: {
    b: { type: 'bold' },
  },
})

export const input = <b>word</b>

export const output = {
  text: 'word',
  marks: [{ type: 'bold' }],
}
