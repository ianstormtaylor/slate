/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { __clear } from '../../lib/utils/memoize'

export default function ({ state, next }) {
  state.document.updateNode(next)
}

export function before(state) {
  const texts = state.document.getTexts()
  const { size } = texts
  const text = texts.get(Math.round(size / 2))
  const next = text.insertText(0, 'some text')
  __clear()
  return { state, next }
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
