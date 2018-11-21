/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    title: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'title' }],
          min: 1,
          max: 1,
        },
        {
          match: [{ type: 'paragraph' }],
          min: 1,
        },
      ],
      normalize: (editor, { code, node, index, count }) => {
        if (code == 'child_min_invalid') {
          const type = index === 0 ? 'title' : 'paragraph'

          editor.insertNodeByKey(node.key, index, {
            object: 'block',
            type,
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
        <block type="title">
          <text />
        </block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <block type="title">
          <text />
        </block>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
