/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { resetMemoization } from '../..'

export default function({ value, text }) {
  value.document.hasNode(text.key)
}

export function before(value) {
  const text = value.document.getLastText()
  resetMemoization()
  return { value, text }
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
