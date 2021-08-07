/** @jsx jsx */
import { Editor, Node, Text, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <block a />, {
    match: (node, currentPath) => {
      // reject all nodes inside blocks tagged `noneditable`. Which is everything.
      if (node.noneditable) return false
      for (const [node, _] of Node.ancestors(editor, currentPath)) {
        if (node.noneditable) return false
      }
      return true
    },
  })
}
export const input = (
  <editor>
    <block noneditable>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block noneditable>
      <cursor />
      word
    </block>
  </editor>
)
