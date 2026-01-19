/** @jsx jsx */
import { Transforms, Element, Editor } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block void>
        <text />
      </block>
    </fragment>,
    {
      ...options,
      filter: (node, _filterOptions) => {
        // Filter out void blocks when inserting into a specific block type
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
// Since the void block is filtered out, nothing should be inserted
export const output = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
