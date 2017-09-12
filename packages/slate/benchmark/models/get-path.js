/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { __clear } from '../../lib/utils/memoize'

export default function ({ state, text }) {
  state.document.getPath(text.key)
}

export function before(state) {
  const text = state.document.getLastText()
  __clear()
  return { state, text }
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
