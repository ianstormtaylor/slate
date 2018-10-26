/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { anchor } = editor.value.selection
  editor.replaceTextByKey(anchor.key, anchor.offset, 3, 'cat is cute')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>Meow, </b>
        <cursor />word.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>Meow, </b>
        cat is cute<cursor />d.
      </paragraph>
    </document>
  </value>
)
