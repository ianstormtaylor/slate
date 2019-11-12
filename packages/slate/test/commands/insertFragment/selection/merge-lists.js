/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(

    <block>
      <block>3</block>
      <block>4</block>
    </block>

  )
}

export const input = (
  <value>

    <block>
      <block>1</block>
      <block>
        2<cursor />
      </block>
    </block>

  </value>
)

export const output = (
  <value>

    <block>
      <block>1</block>
      <block>23</block>
      <block>
        4<cursor />
      </block>
    </block>

  </value>
)
