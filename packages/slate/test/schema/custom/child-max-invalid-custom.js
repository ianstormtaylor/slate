/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'title' }],
          max: 1,
        },
        {
          match: [{ type: 'paragraph' }],
        },
      ],
      normalize: (editor, { code, node, index }) => {
        if (code == 'child_max_invalid') {
          editor.mergeNodeByKey(node.nodes.get(index).key)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block type="title">One</block>
        <block type="title">Two</block>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <block type="title">OneTwo</block>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
