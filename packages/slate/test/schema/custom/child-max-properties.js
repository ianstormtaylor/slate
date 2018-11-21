/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          max: 1,
        },
      ],
      normalize: (editor, { code, node, child, index, count, limit }) => {
        if (code === 'child_max_invalid') {
          editor.removeNodeByKey(child.key)

          editor.setNodeByKey(node.key, {
            data: node.data.merge({
              max: { index, count, limit },
            }),
          })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
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
      <quote max={{ index: 1, count: 2, limit: 1 }}>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
