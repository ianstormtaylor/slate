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
      <block>
        one <mark key="b">two</mark> three
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)
