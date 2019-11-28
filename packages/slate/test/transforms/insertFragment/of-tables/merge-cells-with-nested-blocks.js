/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <block>
      <block>
        <block>
          <block>
            <block>1</block>
          </block>
          <block>
            <block>2</block>
          </block>
        </block>
      </block>
    </block>
  )
}

export const input = (
  <editor>
    <block>
      <block>
        <block>
          <block>
            <block>
              <cursor />
            </block>
          </block>
          <block>
            <block>
              <text />
            </block>
          </block>
        </block>
      </block>
    </block>
  </editor>
)

// TODO: surely this is the wrong behavior.
// ideally, paragraph with "2" goes into second cell
export const output = (
  <editor>
    <block>
      <block>
        <block>
          <block>
            <block>1</block>
            <block>
              <block>
                2<cursor />
              </block>
            </block>
          </block>
          <block>
            <block>
              <text />
            </block>
          </block>
        </block>
      </block>
    </block>
  </editor>
)

export const skip = true
