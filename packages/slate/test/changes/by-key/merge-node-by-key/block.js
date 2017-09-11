/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.mergeNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph key="a">
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        onetwo
      </paragraph>
    </document>
  </state>
)
