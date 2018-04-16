/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'remove_node',
    path: [0],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        The decoration begins<highlightAnchor key="1" /> in this soon deleted
        paragraph
      </paragraph>
      <paragraph>
        And ends in this <highlightFocus key="1" />one.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <highlightAnchor key="1" />And ends in this <highlightFocus key="1" />one.
      </paragraph>
    </document>
  </value>
)
