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
        <text />
        <inline>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
        <inline someKey>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
