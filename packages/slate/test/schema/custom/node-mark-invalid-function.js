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
      <paragraph>
        one <i>two</i> <u>three</u>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one two <u>three</u>
      </paragraph>
    </document>
  </value>
)
