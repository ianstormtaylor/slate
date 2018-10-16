/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: [{ type: 'paragraph' }],
      normalize: (change, { code, child }) => {
        if (code == 'first_child_type_invalid') {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <image>
          <text />
        </image>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <image>
            <text />
          </image>
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
