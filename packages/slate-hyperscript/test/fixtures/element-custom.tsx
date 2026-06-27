/** @jsx jsx */
import { createHyperscript } from 'slate-hyperscript'

declare namespace jsx.JSX {
  interface IntrinsicElements {
    paragraph: {}
  }
}

const jsx = createHyperscript({
  elements: {
    paragraph: { type: 'paragraph' },
  },
})
export const input = <paragraph>word</paragraph>
export const output = {
  type: 'paragraph',
  children: [
    {
      text: 'word',
    },
  ],
}
