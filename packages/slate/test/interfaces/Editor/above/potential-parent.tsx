/** @jsx jsx */
import { Editor, Element } from 'slate'
import { jsx } from '../../..'

// `above` can never return the location passed into it, and shouldnt care if it exists, only if its parent exists.

export const input = (
  <editor>
    <block>
      <block>
        <block>one</block>
        {/* path points here */}
      </block>
      <block>two</block>
    </block>
  </editor>
)

const path = [0, 0, 1]

export const test = editor => {
  return Editor.above(editor, {
    at: path,
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  })
}

export const output = [
  <block>
    <block>one</block>
  </block>,
  [0, 0],
]
