/** @jsx h */

import { Editor } from 'slate'

export const input = new Editor()

input.registerCommand('customCommand')

export default function(editor) {
  return editor.hasCommand('otherCommand')
}

export const output = false
