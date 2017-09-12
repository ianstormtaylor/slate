/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import SCHEMA from '../../lib/schemas/core'

export default function (state) {
  state
    .change()
    .normalize(SCHEMA)
}

export const input = (
  <state>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a textarea!
              {i == 0 ? <cursor /> : ''}
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </state>
)
