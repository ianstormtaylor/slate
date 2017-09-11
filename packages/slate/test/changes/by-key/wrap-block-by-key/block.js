/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.wrapBlockByKey('a', 'quote')
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          word
        </paragraph>
      </quote>
    </document>
  </state>
)
