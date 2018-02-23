/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == null || v == 'value',
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph thing="invalid" />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
