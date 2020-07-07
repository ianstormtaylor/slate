/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      wo
      <anchor />
      rd
      <focus />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.wrapNodes(editor, <block new />, { split: true })
}
export const output = (
  <editor>
    <block>wo</block>
    <block new>
      <block>
        <anchor />
        rd
        <focus />
      </block>
    </block>
  </editor>
)
