/** @jsx h */

import Plain from 'slate-plain-serializer'

const defaultValue = Plain.deserialize('')

const plugins = [
  {
    customCommand: () => {},
  },
]

export const input = { defaultValue, plugins }

export default function(editor) {
  return editor.has('customCommand')
}

export const output = true
