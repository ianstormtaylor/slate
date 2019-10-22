/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      next: [{ type: 'paragraph' }],
      normalize: (editor, { code, path }) => {
        if (code === 'next_sibling_type_invalid') {
          editor.wrapBlockByPath(path, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <text />
      </block>
      <block void>
        <text />
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
      <block>
        <block void>
          <text />
        </block>
      </block>
    </document>
  </value>
)
