/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapBlock({
    type: 'quote',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote thing="value">
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </state>
)
