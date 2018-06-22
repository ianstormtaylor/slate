/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../helpers/h'

export default function(change) {
  change.deleteBackward()
}

export function before(value) {
  const change = value.change()
  return change
}

export const input = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
              {i == 0 ? <cursor /> : ''}
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
