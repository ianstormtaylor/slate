/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
export const run = editor => {
  Editor.withoutNormalizing(editor, () => {
    const operations = [
      {
        type: 'split_node',
        path: [0, 1],
        position: 0,
        properties: { inline: true },
      },
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: {},
      },
      {
        type: 'split_node',
        path: [2, 1, 0],
        position: 0,
        properties: {},
      },
      {
        type: 'split_node',
        path: [2, 1],
        position: 0,
        properties: { inline: true },
      },
      {
        type: 'split_node',
        path: [2],
        position: 1,
        properties: {},
      },
      { type: 'insert_node', path: [2, 1], node: { text: '' } },
    ]
    operations.forEach(editor.apply)
  })
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <text />
      <inline>one</inline>
      <text />
    </block>
    <block>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
