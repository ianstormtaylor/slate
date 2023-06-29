/** @jsx h */

import h from '../../../helpers/h'
import { Selection } from 'slate'

export default function(simulator) {
  const { value } = simulator
  const text = value.document.getTexts().first()
  const selection = Selection.create()
    .collapseToStartOf(text)
    .move(1)
    .focus()
  simulator.select(null, { selection })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </value>
)
