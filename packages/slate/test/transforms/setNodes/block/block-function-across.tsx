/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

const updateFunction = props => {
  return { ...props, key: !props.key }
}

export const run = editor => {
  Transforms.setNodes(editor, updateFunction, {
    match: n => Editor.isBlock(editor, n),
  })
}

export const input = (
  <editor>
    <block key={false}>
      <anchor />
      word
    </block>
    <block key={false}>
      a<focus />
      nother
    </block>
  </editor>
)
export const output = (
  <editor>
    <block key>
      <anchor />
      word
    </block>
    <block key>
      a<focus />
      nother
    </block>
  </editor>
)
