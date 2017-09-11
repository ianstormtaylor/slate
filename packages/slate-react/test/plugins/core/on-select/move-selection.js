/** @jsx h */

import h from '../../../helpers/h'
import { Selection } from 'slate'

export default function (simulator) {
  const { state } = simulator
  const text = state.document.getTexts().first()
  const selection = Selection.create().collapseToStartOf(text).move(1).focus()
  simulator.select(null, { selection })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </state>
)
