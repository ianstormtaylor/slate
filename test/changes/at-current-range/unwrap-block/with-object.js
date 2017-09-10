/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapBlock({
    type: 'quote',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <quote thing="value">
        <paragraph>
          word
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)
