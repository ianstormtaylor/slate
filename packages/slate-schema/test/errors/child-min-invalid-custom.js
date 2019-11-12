/** @jsx jsx */

import { jsx } from '../../helpers'

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
        <block>
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
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)
