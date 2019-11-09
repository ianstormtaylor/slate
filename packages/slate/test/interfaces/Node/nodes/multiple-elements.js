/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
    </element>
    <element>
      <text key="b" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.nodes(value))
}

export const output = [
  [
    <value>
      <element>
        <text key="a" />
      </element>
      <element>
        <text key="b" />
      </element>
    </value>,
    [],
  ],
  [
    <element>
      <text key="a" />
    </element>,
    [0],
  ],
  [<text key="a" />, [0, 0]],
  [
    <element>
      <text key="b" />
    </element>,
    [1],
  ],
  [<text key="b" />, [1, 0]],
]
