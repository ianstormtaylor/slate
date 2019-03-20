/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { anchor } = editor.value.selection

  editor.replaceTextByKey(anchor.key, anchor.offset, 3, 'cat is cute', [
    { type: 'font-size', data: { size: 16 } },
  ])
}

export const input = (
  <value>
    <document>
      <paragraph>
        Meow,{' '}
        <fontSize size={12}>
          <cursor />word.
        </fontSize>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Meow, <fontSize size={16}>cat is cute</fontSize>
        <fontSize size={12}>
          <cursor />d.
        </fontSize>
      </paragraph>
    </document>
  </value>
)
