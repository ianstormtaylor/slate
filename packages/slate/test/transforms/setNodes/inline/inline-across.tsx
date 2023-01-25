/** @jsx jsx */
import { Editor, Transforms, Element } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: n => Element.isElement(n) && Editor.isInline(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <anchor />
        word
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        another
        <focus />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline someKey>
        <anchor />
        word
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline someKey>
        another
        <focus />
      </inline>
      <text />
    </block>
  </editor>
)
