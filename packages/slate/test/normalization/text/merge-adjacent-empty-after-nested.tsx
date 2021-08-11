/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <block>
        <cursor />
        <text />
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </editor>
)
