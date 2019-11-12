/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v === 'value',
      },
      normalize: (editor, { code, path }) => {
        if (code === 'node_data_invalid') {
          editor.setNodeByPath(path, { data: { thing: 'value' } })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="value">
        <text />
      </block>
    </document>
  </value>
)
