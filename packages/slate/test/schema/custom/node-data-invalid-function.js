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
      <paragraph thing="valid">
        <text />
      </paragraph>
      <paragraph thing="invalid">
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="valid">
        <text />
      </paragraph>
    </document>
  </value>
)
