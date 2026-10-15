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
      filter: (node, filterOptions) => {
        // Filter out void blocks when the destination block is a 'lic' type
        const [blockNode] = filterOptions.blockEntry
        if (
          blockNode.type === 'lic' &&
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
    <block type="lic">
      wo
      <cursor />
      rd
    </block>
  </editor>
)
// Since the void block is filtered out when destination is 'lic', nothing should be inserted
export const output = (
  <editor>
    <block type="lic">
      wo
      <cursor />
      rd
    </block>
  </editor>
)
