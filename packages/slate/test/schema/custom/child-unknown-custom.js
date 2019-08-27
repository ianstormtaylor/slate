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
      normalize: (editor, { code, path }) => {
        if (code === 'child_unknown') {
          editor.mergeNodeByPath(path)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <block type="title">two</block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>onetwo</paragraph>
      </quote>
    </document>
  </value>
)
