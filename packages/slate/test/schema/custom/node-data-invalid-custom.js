/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v === 'value',
      },
      normalize: (editor, { code, node, key }) => {
        if (code === 'node_data_invalid') {
          editor.setNodeByKey(node.key, { data: { thing: 'value' } })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="value">
        <text />
      </paragraph>
    </document>
  </value>
)
