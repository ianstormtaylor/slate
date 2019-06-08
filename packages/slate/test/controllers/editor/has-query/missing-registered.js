/** @jsx h */

import { Editor } from 'slate'

export const input = new Editor()

input.registerQuery('customQuery')

export default function(editor) {
  return editor.hasQuery('otherQuery')
}

export const output = false
