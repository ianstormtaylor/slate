/** @jsx h */

import { Editor } from 'slate'

const plugins = [
  {
    commands: {
      customCommand: () => {},
    },
  },
]

export const input = new Editor({ plugins })

export default function(editor) {
  return editor.hasCommand('otherCommand')
}

export const output = false
