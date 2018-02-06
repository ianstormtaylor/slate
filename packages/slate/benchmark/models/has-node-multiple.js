/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { __clear } from '../../lib/utils/memoize'

export default function({ value, keys }) {
  keys.forEach(key => {
    value.document.hasNode(key)
  })
}

export function before(value) {
  const keys = value.document
    .getTexts()
    .toArray()
    .map(t => t.key)
  __clear()
  return { value, keys }
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
