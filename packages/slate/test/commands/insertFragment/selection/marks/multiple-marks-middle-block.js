/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    <block>
      <mark key="a">b</mark>
      <mark key="c">u</mark>
      <mark key="b">i</mark>
    </block>
  )
}

export const input = (
  <value>
    <block>
      wo<cursor />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">b</mark>
      <mark key="c">u</mark>
      <mark key="b">
        i<cursor />
      </mark>
      rd
    </block>
  </value>
)
