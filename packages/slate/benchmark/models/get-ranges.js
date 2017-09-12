/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { __clear } from '../../lib/utils/memoize'

export default function (text) {
  text.getRanges()
}

export function before(state) {
  const text = state.document.getFirstText()
  __clear()
  return text
}

export const input = (
  <state>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </state>
)
