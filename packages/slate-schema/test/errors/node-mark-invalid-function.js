/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: [{ type: t => ['bold', 'underline'].includes(t) }],
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        one <mark key="b">two</mark> <mark key="c">three</mark>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        one two <mark key="c">three</mark>
      </block>
    </document>
  </value>
)
