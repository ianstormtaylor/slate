/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
      normalize: (editor, { code, path }) => {
        if (code === 'node_text_invalid') {
          editor.removeChildrenByPath(path)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>invalid</block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)
