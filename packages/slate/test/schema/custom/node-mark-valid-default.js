/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: [{ type: 'bold' }, { type: 'underline' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <b>two</b> three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one <b>two</b> three
      </paragraph>
    </document>
  </value>
)
