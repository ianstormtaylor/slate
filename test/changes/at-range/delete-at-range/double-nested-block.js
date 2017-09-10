/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .deleteAtRange(state.selection)
}

export const input = (
  <state>
    <document>

    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <list>
        <item>
          <line>Text</line>
        </item>
      </list>
    </document>
  </state>
)
