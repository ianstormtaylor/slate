/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ object: 'block', type: 'image' }],
          min: 0,
          max: 1,
        },
        {
          match: [{ object: 'block', type: 'paragraph' }],
          min: 1,
        },
      ],
      normalize: (change, error) => {
        const { code, child } = error

        if (code === 'child_object_invalid') {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>text</quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>text</paragraph>
      </quote>
    </document>
  </value>
)
