/** @jsx jsx */
import { Transforms, Element, Editor } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>hello</block>
      <block void>
        <text />
      </block>
      <block>world</block>
    </fragment>,
    {
      ...options,
      filter: (node, _filterOptions) => {
        // Filter out void blocks but allow text and non-void blocks
        if (
          Element.isElement(node) &&
          Editor.isBlock(editor, node) &&
          editor.isVoid(node)
        ) {
          return false
        }
        return true
      },
    }
  )
}
export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
// The void block is filtered out, but text blocks are inserted
export const output = (
  <editor>
    <block>wohello</block>
    <block>
      world
      <cursor />
      rd
    </block>
  </editor>
)
