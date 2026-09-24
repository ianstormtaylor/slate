/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <element>
    {true}
    {true && 'if true'}
    {false && 'if false'}
  </element>
)
export const output = {
  children: [
    {
      text: 'if true',
    },
  ],
}
