/** @jsx jsx */

import { jsx } from '../../helpers'

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
      <block>
        one <mark key="a">two</mark> three
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        one <mark key="a">two</mark> three
      </block>
    </document>
  </value>
)
