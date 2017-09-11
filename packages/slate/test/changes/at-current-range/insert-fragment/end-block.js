/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        fragment
      </quote>
    </document>
  ))
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wordfragment<cursor />
      </paragraph>
    </document>
  </state>
)
