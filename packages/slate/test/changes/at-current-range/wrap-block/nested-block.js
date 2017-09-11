/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.wrapBlock('quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <quote>
          <paragraph>
            <cursor />word
          </paragraph>
        </quote>
      </quote>
    </document>
  </state>
)
