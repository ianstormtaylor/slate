/** @jsx h */

import { Editor } from 'slate'

export const input = new Editor().registerCommand('customCommand')

export default function(editor) {
  return editor.hasCommand('otherCommand')
}

export const output = false
