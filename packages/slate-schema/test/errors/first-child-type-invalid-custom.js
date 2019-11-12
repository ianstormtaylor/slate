/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: [{ type: 'paragraph' }],
      normalize: (editor, { code, path }) => {
        if (code === 'first_child_type_invalid') {
          editor.wrapBlockByPath(path, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block void>
          <text />
        </block>
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

export const output = (
  <value>
    <document>
      <quote>
        <block>
          <block void>
            <text />
          </block>
        </block>
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
