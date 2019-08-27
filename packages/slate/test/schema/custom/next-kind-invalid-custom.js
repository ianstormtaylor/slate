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
      <paragraph>
        <image>
          <text />
        </image>
        <quote>
          <text />
        </quote>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <image>
          <text />
        </image>
      </paragraph>
      <quote>
        <text />
      </quote>
    </document>
  </value>
)
