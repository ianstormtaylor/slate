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
      normalize: (editor, { code, path }) => {
        if (code === 'child_min_invalid') {
          editor.insertNodeByPath(path, {
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
        <block>
          <text />
        </block>
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)
