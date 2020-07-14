/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, { match: () => true, mode: 'highest' })
}
export const input = (
  <editor>
    <block>
      <block>
        <block>
          wo
          <cursor />
          rd
        </block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        <block>wo</block>
      </block>
    </block>
    <block>
      <block>
        <block>
          <cursor />
          rd
        </block>
      </block>
    </block>
  </editor>
)
