/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        one
      </quote>
      <quote>
        two
      </quote>
    </document>
  ))
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        woone
      </paragraph>
      <quote>
        two<cursor />rd
      </quote>
    </document>
  </state>
)
