/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>
        two<inline>three</inline>four
      </inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.nodes({ at: [] }))
}

export const output = [
  [
    <value>
      <block>
        one<inline>
          two<inline>three</inline>four
        </inline>five
      </block>
    </value>,
    [],
  ],
  [
    <block>
      one<inline>
        two<inline>three</inline>four
      </inline>five
    </block>,
    [0],
  ],
  [<text>one</text>, [0, 0]],
  [
    <inline>
      two<inline>three</inline>four
    </inline>,
    [0, 1],
  ],
  [<text>two</text>, [0, 1, 0]],
  [<inline>three</inline>, [0, 1, 1]],
  [<text>three</text>, [0, 1, 1, 0]],
  [<text>four</text>, [0, 1, 2]],
  [<text>five</text>, [0, 2]],
]
