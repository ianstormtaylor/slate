/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          word<cursor />
        </paragraph>
        <paragraph>
          another
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          word<cursor />another
        </paragraph>
      </quote>
    </document>
  </state>
)
