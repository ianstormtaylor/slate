/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      parent: { object: 'document' },
      normalize: (editor, { code, path }) => {
        if (code === 'parent_object_invalid') {
          editor.unwrapNodeByPath(path)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block>one</block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>one</block>
    </document>
  </value>
)
