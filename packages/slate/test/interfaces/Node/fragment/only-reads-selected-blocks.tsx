/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from '../../..'

const blocks = Array.from({ length: 10 }, (_, i) => (
  <block>{`block ${i}`}</block>
))

export const input = {
  children: new Proxy(blocks, {
    get(target, key, receiver) {
      const index = typeof key === 'string' ? Number(key) : NaN
      if (index < 4 || index > 5) {
        throw new Error(`Read unselected block ${index}`)
      }
      return Reflect.get(target, key, receiver)
    },
  }),
}
export const test = value => {
  return Node.fragment(value, {
    anchor: { path: [4, 0], offset: 6 },
    focus: { path: [5, 0], offset: 5 },
  })
}
export const output = [<block>4</block>, <block>block</block>]
