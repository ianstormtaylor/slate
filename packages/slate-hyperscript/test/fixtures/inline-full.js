/** @jsx h */

import h from 'slate-hyperscript'

export const input = <inline type="link">word</inline>

export const output = {
  object: 'inline',
  type: 'link',
  data: {},
  nodes: [
    {
      object: 'text',
      leaves: [
        {
          object: 'leaf',
          text: 'word',
          marks: [],
        },
      ],
    },
  ],
}
