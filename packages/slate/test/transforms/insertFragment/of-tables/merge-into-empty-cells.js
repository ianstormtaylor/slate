/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <block>
      <block>
        <block>
          <block>1</block>
          <block>2</block>
        </block>
      </block>
    </block>
  )
}

export const input = (
  <value>
    <block>
      <block>
        <block>
          <block>
            <cursor />
          </block>
          <block>
            <text />
          </block>
        </block>
      </block>
    </block>
  </value>
)

// TODO: paste "2" into second cell instead of creating new one?
export const output = (
  <value>
    <block>
      <block>
        <block>
          <block>1</block>
          <block>
            2<cursor />
          </block>
          <block>
            <text />
          </block>
        </block>
      </block>
    </block>
  </value>
)

export const skip = true
