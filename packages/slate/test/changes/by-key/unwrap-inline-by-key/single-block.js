/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInlineByKey('a', 'link')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<link key="a">or</link>d<link>another</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<link>another</link>
      </paragraph>
    </document>
  </state>
)
