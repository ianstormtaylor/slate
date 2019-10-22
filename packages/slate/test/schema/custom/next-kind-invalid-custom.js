/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      next: [{ object: 'inline' }, { object: 'text' }],
      normalize: (editor, { code, path }) => {
        if (code === 'next_sibling_object_invalid') {
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
        <block void>
          <text />
        </block>
        <quote>
          <text />
        </quote>
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
      <quote>
        <text />
      </quote>
    </document>
  </value>
)
