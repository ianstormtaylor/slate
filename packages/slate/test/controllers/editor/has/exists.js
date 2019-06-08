/** @jsx h */

import { Editor } from 'slate'

const plugins = [
  {
    customCommand: () => () => {},
  },
]

export const input = new Editor({ plugins })

export default function(editor) {
  return editor.has('customCommand')
}

export const output = true
