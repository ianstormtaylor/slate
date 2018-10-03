/** @jsx h */

import h from 'slate-hyperscript'

export const input = <text key="a">word</text>

export const options = {
  preserveKeys: true,
}

export const output = {
  object: 'text',
  key: 'a',
  leaves: [
    {
      object: 'leaf',
      text: 'word',
      marks: [],
    },
  ],
}
