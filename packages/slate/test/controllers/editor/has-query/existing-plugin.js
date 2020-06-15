/** @jsx h */

import { Editor } from 'slate'

const plugins = [
  {
    queries: {
      customQuery: () => {},
    },
  },
]

export const input = new Editor({ plugins })

export default function(editor) {
  return editor.hasQuery('customQuery')
}

export const output = true
