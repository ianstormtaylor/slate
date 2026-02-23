/** @jsx jsx */
import { Node, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <block a />, {
    match: (node, currentPath) => {
      // reject all nodes inside blocks tagged `x`. Which is everything.
      if (node.x) return false
      for (const [node, _] of Node.ancestors(editor, currentPath)) {
        if (node.x) return false
      }
      return true
    },
  })
}
export const input = (
  <editor>
    <block x>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block x>
      <cursor />
      word
    </block>
  </editor>
)
