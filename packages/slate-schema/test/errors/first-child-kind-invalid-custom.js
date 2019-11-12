/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: [{ object: 'block' }],
      normalize: (editor, { code, path }) => {
        if (code === 'first_child_object_invalid') {
          editor.wrapBlockByPath(path, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>text</quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <block>text</block>
      </quote>
    </document>
  </value>
)
