/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      next: [{ type: 'paragraph' }],
      normalize: (change, { code, next }) => {
        if (code == 'next_sibling_type_invalid') {
          change.wrapBlockByKey(next.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph />
      <image />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <paragraph>
        <image />
      </paragraph>
    </document>
  </value>
)
