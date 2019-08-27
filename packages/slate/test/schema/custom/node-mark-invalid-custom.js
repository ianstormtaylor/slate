/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: [{ type: 'bold' }],
      normalize: (editor, { code, path }) => {
        if (code === 'node_mark_invalid') {
          editor.removeChildrenByPath(path)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <i>two</i> three
      </paragraph>
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
