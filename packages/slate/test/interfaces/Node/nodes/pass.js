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
  return Array.from(Node.nodes(value, { pass: ([n, p]) => p.length > 1 }))
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
]
