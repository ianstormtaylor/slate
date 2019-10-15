/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <element>
        <text key="a" />
      </element>
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.entries(value))
}

export const output = [
  [
    <value>
      <element>
        <element>
          <text key="a" />
        </element>
      </element>
    </value>,
    [],
  ],
  [
    <element>
      <element>
        <text key="a" />
      </element>
    </element>,
    [0],
  ],
  [
    <element>
      <text key="a" />
    </element>,
    [0, 0],
  ],
  [<text key="a" />, [0, 0, 0]],
]
