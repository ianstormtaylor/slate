/** @jsx jsx */
import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      on
      <anchor />e
    </block>
    <block>
      t<focus />
      wo
    </block>
  </editor>
)
export const run = (editor) => {
  Transforms.wrapNodes(editor, <block new />, { split: true })
}
export const output = (
  <editor>
    <block>on</block>
    <block new>
      <block>
        <anchor />e
      </block>
      <block>
        t<focus />
      </block>
    </block>
    <block>wo</block>
  </editor>
)
