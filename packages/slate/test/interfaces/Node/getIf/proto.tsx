/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text />
    </element>
  </editor>
)
export const test = value => {
  try {
    return Node.getIf(value, ['__proto__' as any])
  } catch (error) {
    return error.message
  }
}
export const output = 'Got non-numeric path index'
