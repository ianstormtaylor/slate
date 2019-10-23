/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(

    <block>
      <block>
        <block>2</block>
      </block>
      <block>
        <block>3</block>
      </block>
    </block>

  )
}

export const input = (
  <value>

    <block>
      <block>
        <block>
          1<cursor />
        </block>
      </block>
    </block>

  </value>
)

export const output = (
  <value>

    <block>
      <block>
        <block>12</block>
      </block>
      <block>
        <block>
          3<cursor />
        </block>
      </block>
    </block>

  </value>
)

export const skip = true
