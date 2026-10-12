/** @jsx jsx */
import assert from 'assert'
import { HyperscriptPointRef, jsx } from 'slate-hyperscript'

const afterOneRef = new HyperscriptPointRef()
const afterTwoRef = new HyperscriptPointRef()

export const input = (
  <editor>
    <element>
      one
      <point ref={afterOneRef} />
      two
      <point ref={afterTwoRef} />
      three
    </element>
  </editor>
)

const afterOne = afterOneRef.point()
const afterTwo = afterTwoRef.point()

export const output = {
  children: [
    {
      children: [
        {
          text: 'onetwothree',
        },
      ],
    },
  ],
  selection: null,
}

export function test() {
  assert.deepEqual(afterOne, { path: [0, 0], offset: 3 })
  assert.deepEqual(afterTwo, { path: [0, 0], offset: 6 })
}
