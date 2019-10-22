/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: 'paragraph' }],
      normalize: (editor, { code, path }) => {
        if (code === 'previous_sibling_type_invalid') {
          editor.wrapBlockByPath(path, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block void>
        <text />
      </block>
      <block>
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <block void>
          <text />
        </block>
      </block>
      <block>
        <text />
      </block>
    </document>
  </value>
)
