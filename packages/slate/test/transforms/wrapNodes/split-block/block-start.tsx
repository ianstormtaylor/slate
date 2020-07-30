/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <anchor />
      wo
      <focus />
      rd
    </block>
  </editor>
)
export const run = editor => {
  Transforms.wrapNodes(editor, <block new />, { split: true })
}
export const output = (
  <editor>
    <block new>
      <block>
        <anchor />
        wo
        <focus />
      </block>
    </block>
    <block>rd</block>
  </editor>
)
