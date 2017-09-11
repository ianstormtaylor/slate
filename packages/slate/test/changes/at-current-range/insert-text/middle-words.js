/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertText(' a few words ')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w a few words <cursor />ord
      </paragraph>
    </document>
  </state>
)
