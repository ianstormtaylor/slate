/** @jsx jsx */
import assert from 'assert'
import {
  HyperscriptPointRef,
  HyperscriptRangeRef,
  jsx,
} from 'slate-hyperscript'

const rangeRef = new HyperscriptRangeRef()

export const input = (
  <editor>
    <element>
      one
      <anchor />
      two
      <anchor ref={rangeRef} />
      three
      <focus />
      four
      <focus ref={rangeRef} />
      five
    </element>
  </editor>
)

const range = rangeRef.range()

export const output = {
  children: [
    {
      children: [
        {
          text: 'onetwothreefourfive',
        },
      ],
    },
  ],
  selection: {
    anchor: { path: [0, 0], offset: 3 },
    focus: { path: [0, 0], offset: 11 },
  },
}

export function test() {
  assert.deepEqual(range, {
    anchor: { path: [0, 0], offset: 6 },
    focus: { path: [0, 0], offset: 15 },
  })
}
