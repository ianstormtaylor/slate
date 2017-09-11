/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline({
    type: 'link'
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <emoji><cursor />{' '}</emoji>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          <emoji><cursor />{' '}</emoji>
        </link>
      </paragraph>
    </document>
  </state>
)
