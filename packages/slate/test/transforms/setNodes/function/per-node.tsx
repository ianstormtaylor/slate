/** @jsx jsx */
import { Element, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    (node, path) => ({
      id: `${(node as Element & { id?: string }).id}-${path[0]}`,
    }),
    { at: [], match: (n, p) => p.length === 1 }
  )
}
export const input = (
  <editor>
    <block id="a">one</block>
    <block id="b">two</block>
  </editor>
)
export const output = (
  <editor>
    <block id="a-0">one</block>
    <block id="b-1">two</block>
  </editor>
)
