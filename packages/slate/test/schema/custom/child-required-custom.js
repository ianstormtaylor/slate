/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          min: 2,
        },
      ],
      normalize: (change, { code, node, index }) => {
        if (code == 'child_required') {
          change.insertNodeByKey(node.key, index, {
            object: 'block',
            type: 'paragraph',
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
      </quote>
    </document>
  </value>
)

export const output = (
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
