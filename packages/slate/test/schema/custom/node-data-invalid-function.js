/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: d => d.get('thing') === 'valid',
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph thing="valid" />
      <paragraph thing="invalid" />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="valid" />
    </document>
  </value>
)
