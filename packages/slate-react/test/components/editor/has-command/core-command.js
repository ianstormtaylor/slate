/** @jsx h */

import Plain from 'slate-plain-serializer'

const defaultValue = Plain.deserialize('')

export const input = { defaultValue }

export default function(editor) {
  return editor.hasCommand('insertText')
}

export const output = true
