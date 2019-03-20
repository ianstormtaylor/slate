/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: [{ type: 'paragraph' }],
      normalize: (editor, { code, child }) => {
        if (code === 'last_child_type_invalid') {
          editor.wrapBlockByKey(child.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
        <image>
          <text />
        </image>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <image>
            <text />
          </image>
        </paragraph>
      </quote>
    </document>
  </value>
)
