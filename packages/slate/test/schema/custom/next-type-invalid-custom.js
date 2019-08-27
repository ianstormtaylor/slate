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
      <paragraph>
        <text />
      </paragraph>
      <image>
        <text />
      </image>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>
        <image>
          <text />
        </image>
      </paragraph>
    </document>
  </value>
)
