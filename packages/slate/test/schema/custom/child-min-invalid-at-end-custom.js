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
