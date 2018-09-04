/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      previous: [{ object: 'inline' }, { object: 'text' }],
      normalize: (change, { code, previous }) => {
        if (code == 'previous_sibling_object_invalid') {
          change.unwrapBlockByKey(previous.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <quote />
        <image />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote />
      <paragraph>
        <image />
      </paragraph>
    </document>
  </value>
)
