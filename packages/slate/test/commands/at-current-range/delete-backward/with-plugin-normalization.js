/** @jsx h */

import h from '../../../helpers/h'
import { Editor, PathUtils, Block, Text } from 'slate'
import assert from 'assert'

let calls = 0

function normalizeNode(node, editor, next) {
  if (node.type === 'container' && node.nodes.first().type === 'container') {
    calls = 1
    return () => editor.insertNodeByKey(node.key, 0, Block.create({
      type: "paragraph",
      nodes: [Text.create()]
    }))
  }

  return next()
}

export const plugins = [{ normalizeNode }]

export default function(editor) {
  editor.deleteBackward()
  assert(calls === 1)
}


export const input = (
  <value>
    <document>
      <block type="container" key="c1">
        <paragraph key="p1">1 </paragraph>
        <block type="container" key="c2">
          <paragraph key="p2"><cursor />1.1</paragraph>
          <block type="container" key="c3">
            <paragraph key="p3">1.1.1</paragraph>
          </block>
        </block>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block type="container" key="c1">
        <paragraph key="p1">1 <cursor />1.1</paragraph>
        <block type="container" key="c2">
          <paragraph />
          <block type="container" key="c3">
            <paragraph key="p3">1.1.1</paragraph>
          </block>
        </block>
      </block>
    </document>
  </value>
)
