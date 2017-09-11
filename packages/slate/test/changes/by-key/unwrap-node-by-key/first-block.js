/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.unwrapNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph key="a">
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <quote>
        <paragraph>
          two
        </paragraph>
      </quote>
    </document>
  </state>
)
