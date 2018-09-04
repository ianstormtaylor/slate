/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      next: [{ object: 'inline' }, { object: 'text' }],
      normalize: (change, { code, next }) => {
        if (code == 'next_sibling_object_invalid') {
          change.unwrapBlockByKey(next.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <image />
        <quote />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <image />
      </paragraph>
      <quote />
    </document>
  </value>
)
