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
        },
        {
          match: [{ type: 'paragraph' }],
        },
      ],
      normalize: (editor, { code, path }) => {
        if (code === 'child_min_invalid') {
          editor.insertNodeByPath(path, {
            object: 'block',
            type: 'title',
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
