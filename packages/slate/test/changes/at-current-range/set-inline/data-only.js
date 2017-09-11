/** @jsx h */

import { h } from 'slate-core-test-helpers'
import { Data } from '../../../..'

export default function (change) {
  change.setInline({ data: Data.create({ thing: 'value' }) })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><cursor />word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link thing="value"><cursor />word</link>
      </paragraph>
    </document>
  </state>
)
