/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapInlineByKey('a', 'link')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<link key="a">or</link>d<link>another</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<link>another</link>
      </paragraph>
    </document>
  </value>
)
