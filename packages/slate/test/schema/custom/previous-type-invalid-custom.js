/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: 'paragraph' }],
      normalize: (editor, error) => {
        const { code, previous } = error

        if (code === 'previous_sibling_type_invalid') {
          editor.wrapBlockByKey(previous.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <image>
        <text />
      </image>
      <paragraph>
        <text />
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
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)
