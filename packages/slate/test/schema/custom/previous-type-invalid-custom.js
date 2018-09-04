/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: 'paragraph' }],
      normalize: (change, { code, previous }) => {
        if (code == 'previous_sibling_type_invalid') {
          change.wrapBlockByKey(previous.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <image />
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <image />
      </paragraph>
      <paragraph />
    </document>
  </value>
)
