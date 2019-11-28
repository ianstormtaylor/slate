/** @jsx jsx */

import { createHyperscript } from 'slate-hyperscript'

const jsx = createHyperscript({
  marks: {
    b: { type: 'bold' },
  },
})

export const input = <b>word</b>

export const output = {
  text: 'word',
  marks: [{ type: 'bold' }],
}
