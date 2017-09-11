/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        one
      </quote>
      <quote>
        two
      </quote>
      <quote>
        three
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
        wordone
      </paragraph>
      <quote>
        two
      </quote>
      <quote>
        three
      </quote>
    </document>
  </state>
)
