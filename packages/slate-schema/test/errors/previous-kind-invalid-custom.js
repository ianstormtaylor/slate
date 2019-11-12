/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    image: {
      previous: [{ object: 'inline' }, { object: 'text' }],
      normalize: (editor, { code, path }) => {
        if (code === 'previous_sibling_object_invalid') {
          editor.unwrapBlockByPath(path, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <quote>
          <text />
        </quote>
        <block void>
          <text />
        </block>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <text />
      </quote>
      <block>
        <block void>
          <text />
        </block>
      </block>
    </document>
  </value>
)
