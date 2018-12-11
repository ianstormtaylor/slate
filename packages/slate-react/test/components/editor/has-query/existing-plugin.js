/** @jsx h */

import Plain from 'slate-plain-serializer'

const defaultValue = Plain.deserialize('')

const plugins = [
  {
    queries: {
      customQuery: () => {},
    },
  },
]

export const input = { defaultValue, plugins }

export default function(editor) {
  return editor.hasQuery('customQuery')
}

export const output = true
