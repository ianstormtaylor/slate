/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { __clear } from '../../lib/utils/memoize'

export default function ({ change, text }) {
  change.insertTextByKey(text.key, 0, 'a')
}

export function before(value) {
  const change = value.change()
  const text = value.document.getLastText()
  __clear()
  return { change, text }
}

export const input = (
  <value>
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
  </value>
)
