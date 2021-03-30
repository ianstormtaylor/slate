/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

const updateFunction = props => {
  return { ...props, key: !props.key }
}

export const run = editor => {
  Transforms.setNodes(editor, updateFunction, {
    match: n => Editor.isInline(editor, n),
  })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
        <inline key={false}>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
        <inline key>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
