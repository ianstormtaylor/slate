/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: [{ type: 'paragraph' }],
      normalize: (editor, { code, path }) => {
        if (code === 'last_child_type_invalid') {
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
        <block>
          <text />
        </block>
        <block>
          <text />
        </block>
        <block void>
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
        <block>
          <block void>
            <text />
          </block>
        </block>
      </quote>
    </document>
  </value>
)
