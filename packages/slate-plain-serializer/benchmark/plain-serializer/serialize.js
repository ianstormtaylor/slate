/** @jsx h */
/* eslint-disable react/jsx-key */

import Plain from '../..'
import h from '../../test/helpers/h'

export default function(state) {
  Plain.serialize(state)
}

export const input = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
