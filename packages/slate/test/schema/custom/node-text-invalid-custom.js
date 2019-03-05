/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
      normalize: (editor, { code, node }) => {
        if (code === 'node_text_invalid') {
          node.nodes.forEach(n => editor.removeNodeByKey(n.key))
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>invalid</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)
