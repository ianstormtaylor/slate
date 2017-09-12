/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'

export default function (state) {
  state.document.getTextsAtRange(state.selection)
}

export function before(state) {
  return state
    .change()
    .selectAll()
    .state
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
